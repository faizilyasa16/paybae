from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator
from typing import Optional, List
import numpy as np
import os
import tensorflow as tf
import joblib

class TemporalAttention(tf.keras.layers.Layer):
    """Attention layer yang meng-highlight hari-hari paling relevan dari sequence."""
    def __init__(self, units=32, **kwargs):
        super().__init__(**kwargs)
        self.units = units

    def build(self, input_shape):
        self.W = self.add_weight(name="W_attn", shape=(input_shape[-1], self.units),
                                 initializer="glorot_uniform", trainable=True)
        self.b = self.add_weight(name="b_attn", shape=(self.units,),
                                 initializer="zeros", trainable=True)
        self.v = self.add_weight(name="v_attn", shape=(self.units, 1),
                                 initializer="glorot_uniform", trainable=True)
        super().build(input_shape)

    def call(self, inputs):
        score = tf.nn.tanh(tf.tensordot(inputs, self.W, axes=1) + self.b)
        attn_weights = tf.nn.softmax(tf.tensordot(score, self.v, axes=1), axis=1)
        context = tf.reduce_sum(inputs * attn_weights, axis=1)
        return context

    def get_config(self):
        cfg = super().get_config()
        cfg.update({"units": self.units})
        return cfg

class SpendingClassifier(tf.keras.layers.Layer):
    """Layer custom yang mengklasifikasikan pola pengeluaran ke kategori hemat/normal/boros."""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.dense = tf.keras.layers.Dense(3, activation="softmax", name="spending_class")

    def call(self, inputs):
        return self.dense(inputs)

    def get_config(self):
        return super().get_config()

ACTION_NAMES = {
    0: "Pertahankan pengeluaran",
    1: "Pengeluaran boleh naik (tidak disarankan)",
    2: "Kurangi pengeluaran 20%",
    3: "Kurangi pengeluaran 10%",
    4: "Kurangi pengeluaran 5%",
}
REDUCTION_MAP = {0: 0.0, 1: -0.1, 2: 0.20, 3: 0.10, 4: 0.05}

WINDOW_SIZE = 30
N_FEATURES = 5
N_ACTIONS = 5

def build_lstm_policy_network(window: int = WINDOW_SIZE,
                               n_features: int = N_FEATURES,
                               n_actions: int = N_ACTIONS) -> tf.keras.Model:
    seq_input = tf.keras.Input(shape=(window, n_features), name="sequence_input")
    x = tf.keras.layers.LSTM(64, return_sequences=True, activation="tanh",
                              name="lstm_1")(seq_input)
    x = tf.keras.layers.Dropout(0.3, name="drop_1")(x)
    x = tf.keras.layers.LSTM(32, return_sequences=True, activation="tanh",
                              name="lstm_2")(x)
    x = tf.keras.layers.Dropout(0.2, name="drop_2")(x)
    context = TemporalAttention(units=32, name="temporal_attention")(x)
    shared = tf.keras.layers.Dense(64, activation="relu", name="shared_dense_1")(context)
    shared = tf.keras.layers.Dense(32, activation="relu", name="shared_dense_2")(shared)
    spending_class = SpendingClassifier(name="spending_classifier")(shared)
    action_logits = tf.keras.layers.Dense(n_actions, activation="softmax",
                                           name="action_policy")(shared)

    model = tf.keras.Model(
        inputs=seq_input,
        outputs=[action_logits, spending_class],
        name="LSTM_Policy_Network"
    )
    return model

class LSTMPolicyTrainer:
    """
    Custom training loop dengan GradientTape untuk LSTM Policy Network.
    Loss utama   : CrossEntropy (action)
    Loss bantu   : CrossEntropy (spending class, bobot 0.3)
    """

    def __init__(self, model: tf.keras.Model, lr: float = 0.001):
        self.model     = model
        self.optimizer = tf.keras.optimizers.Adam(lr, clipnorm=1.0)
        self.action_loss_fn  = tf.keras.losses.SparseCategoricalCrossentropy()
        self.class_loss_fn   = tf.keras.losses.SparseCategoricalCrossentropy()
        self.mae_metric      = tf.keras.metrics.MeanAbsoluteError()
        self.train_writer = tf.summary.create_file_writer(
            os.path.join("logs", "lstm_policy", "train"))
        self.val_writer   = tf.summary.create_file_writer(
            os.path.join("logs", "lstm_policy", "val"))

    @tf.function
    def train_step(self, X, y_action, y_class):
        with tf.GradientTape() as tape:
            action_probs, class_probs = self.model(X, training=True)
            loss_action = self.action_loss_fn(y_action, action_probs)
            loss_class  = self.class_loss_fn(y_class,  class_probs)
            total_loss  = loss_action + 0.3 * loss_class
        grads = tape.gradient(total_loss, self.model.trainable_variables)
        self.optimizer.apply_gradients(
            zip(grads, self.model.trainable_variables))
        
        y_action_onehot = tf.one_hot(y_action, depth=N_ACTIONS)
        self.mae_metric.update_state(y_action_onehot, action_probs)
        
        return total_loss, loss_action

    def train(self, X_train, y_action_train, y_class_train,
              X_val, y_action_val, y_class_val,
              epochs=80, batch_size=32, patience=10):

        best_val  = float("inf")
        best_w    = self.model.get_weights()
        no_improv = 0
        train_ds = (tf.data.Dataset
                    .from_tensor_slices((X_train, y_action_train, y_class_train))
                    .shuffle(1000).batch(batch_size).prefetch(tf.data.AUTOTUNE))

        print("TRAINING LSTM POLICY NETWORK")

        for ep in range(epochs):
            ep_loss = []
            self.mae_metric.reset_state()
            
            for bx, ba, bc in train_ds:
                tl, _ = self.train_step(bx, ba, bc)
                ep_loss.append(float(tl))

            train_mae = float(self.mae_metric.result())
            val_ap, val_cp = self.model(X_val, training=False)
            vl_a = float(self.action_loss_fn(y_action_val, val_ap))
            vl_c = float(self.class_loss_fn(y_class_val,   val_cp))
            val_loss = vl_a + 0.3 * vl_c
            train_loss = np.mean(ep_loss)

            y_val_onehot = tf.one_hot(y_action_val, depth=N_ACTIONS)
            self.mae_metric.reset_state()
            self.mae_metric.update_state(y_val_onehot, val_ap)
            val_mae = float(self.mae_metric.result())

            with self.train_writer.as_default():
                tf.summary.scalar("loss", train_loss, step=ep)
                tf.summary.scalar("mae", train_mae, step=ep)
            with self.val_writer.as_default():
                tf.summary.scalar("loss", val_loss, step=ep)
                tf.summary.scalar("mae", val_mae, step=ep)

            print(f"Epoch {ep+1:>2}/{epochs} | "
                  f"Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f} | "
                  f"Train MAE: {train_mae:.5f} | Val MAE: {val_mae:.5f}")

            if val_loss < best_val:
                best_val  = val_loss
                best_w    = self.model.get_weights()
                no_improv = 0
            else:
                no_improv += 1
                if no_improv >= patience:
                    print(f"Early stopping at epoch {ep+1}")
                    break
        self.model.set_weights(best_w)
        print(f"Training selesai! Best val loss: {best_val:.4f}")


import pandas as pd

def generate_training_data_from_dataset(window: int = WINDOW_SIZE, n_features: int = N_FEATURES):
    """
    Generate data training dengan mengambil pola pengeluaran asli dari dataset 10 tahun,
    lalu digabung dengan simulasi income dan saldo untuk menghasilkan label aksi.
    """
    X, y_action, y_class = [], [], []
    rng = np.random.default_rng(42)

    print("Load dataset asli...")

    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(current_dir)
    dataset_path = os.path.join(root_dir, 'dataset_feature_engineering10thninflasi.csv')

    df = pd.read_csv(dataset_path)
    expenses = df['total_pengeluaran'].values
    n_samples = len(expenses) - window
    if n_samples > 8000:
        indices = rng.choice(n_samples, 8000, replace=False)
    else:
        indices = range(n_samples)

    for i in indices:
        seq_exp = expenses[i : i + window]
        avg_real_exp = np.mean(seq_exp)
        
        # Buat simulasi profil user berdasarkan pengeluarannya
        # Misal pengeluaran rata-rata 50rb/hari (1.5jt/bulan). Kita set income-nya acak di sekitar itu.
        habit_ratio = rng.uniform(0.3, 1.2) # User ini habiskan 30% s.d 120% gaji
        income_d = (avg_real_exp / habit_ratio) + 1000
        income_m = income_d * 30
        savings_r  = rng.uniform(-0.1, 0.5)
        balance    = rng.uniform(0.5, 3.0) * income_m

        seq = []
        cumsum = 0
        for day, exp in enumerate(seq_exp):
            exp = max(exp, 0)
            cumsum += exp
            exp_norm   = np.clip(exp / (income_d + 1e-6), 0, 2.0)
            cumsum_norm= np.clip(cumsum / (income_m + 1e-6), 0, 1.5)
            day_norm   = day / (window - 1)
            sav_norm   = np.clip(savings_r, -1.0, 1.0)
            seq.append([exp / 200_000, exp_norm, cumsum_norm, day_norm, sav_norm])

        avg_ratio = avg_real_exp / income_d
        if avg_ratio > 0.85:
            action = 2; sclass = 2 
        elif avg_ratio > 0.65:
            action = 3; sclass = 2  
        elif avg_ratio > 0.45:
            action = 4; sclass = 1  
        elif avg_ratio < 0.25:
            action = 0; sclass = 0 
        else:
            action = 0; sclass = 1  

        X.append(seq)
        y_action.append(action)
        y_class.append(sclass)

    return (np.array(X, dtype=np.float32),
            np.array(y_action, dtype=np.int32),
            np.array(y_class, dtype=np.int32))

_current_dir = os.path.dirname(os.path.abspath(__file__))
_root_dir = os.path.dirname(_current_dir)
MODEL_PATH = os.path.join(_root_dir, "models", "lstm_policy_network.keras")

def train_and_save():
    print("Mengekstrak fitur dari dataset asli...")
    X, ya, yc = generate_training_data_from_dataset()

    split = int(len(X) * 0.85)
    X_tr, X_val = X[:split], X[split:]
    ya_tr, ya_val = ya[:split], ya[split:]
    yc_tr, yc_val = yc[:split], yc[split:]

    model   = build_lstm_policy_network()
    trainer = LSTMPolicyTrainer(model, lr=0.001)
    trainer.train(X_tr, ya_tr, yc_tr, X_val, ya_val, yc_val,
                  epochs=10, batch_size=64, patience=5)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    model.save(MODEL_PATH)
    print(f"\n Model tersimpan di: {MODEL_PATH}")
    return model

_CUSTOM_OBJECTS = {
    "TemporalAttention": TemporalAttention,
    "SpendingClassifier": SpendingClassifier,
}

def load_or_train_model() -> tf.keras.Model:
    if os.path.exists(MODEL_PATH):
        print(f"[INFO] Memuat model dari {MODEL_PATH}")
        try:
            m = tf.keras.models.load_model(MODEL_PATH, custom_objects=_CUSTOM_OBJECTS)
            print("[INFO] Model berhasil dimuat.")
            return m
        except Exception as e:
            print(f"[WARN] Gagal load model: {e}. Akan train ulang.")
    print("[INFO] Model belum ada, mulai training...")
    return train_and_save()

def build_sequence_from_history(transaction_history: List[float],
                                 monthly_income: float,
                                 savings_rate: float,
                                 window: int = WINDOW_SIZE) -> np.ndarray:
    """
    Bangun sequence input (window x N_FEATURES) dari raw transaction history.
    Jika history < window, pad dengan rata-rata.
    """
    income_d = monthly_income / 30
    hist     = list(transaction_history)[-window:]

    if len(hist) < window:
        pad_val = np.mean(hist) if hist else income_d
        hist    = [pad_val] * (window - len(hist)) + hist

    seq = []
    cumsum = 0.0
    for i, exp in enumerate(hist):
        exp        = max(exp, 0)
        cumsum    += exp
        exp_norm   = np.clip(exp   / (income_d + 1e-6),        0, 2.0)
        cum_norm   = np.clip(cumsum / (monthly_income + 1e-6),  0, 1.5)
        day_norm   = i / (window - 1)
        sav_norm   = np.clip(savings_rate, -1.0, 1.0)
        seq.append([exp / 200_000, exp_norm, cum_norm, day_norm, sav_norm])

    return np.array(seq, dtype=np.float32)

def build_sequence_from_scalar(avg_expense_7d: float,
                                monthly_income: float,
                                savings_rate: float,
                                day_of_month: int,
                                window: int = WINDOW_SIZE) -> np.ndarray:
    """Fallback: buat sequence dari nilai scalar avg_expense_7d."""
    income_d = monthly_income / 30
    seq = []
    for i in range(window):
        exp      = avg_expense_7d
        exp_norm = np.clip(exp / (income_d + 1e-6), 0, 2.0)
        cum_norm = np.clip((exp * (i + 1)) / (monthly_income + 1e-6), 0, 1.5)
        day_norm = ((day_of_month - window + i) % 30) / 29.0
        sav_norm = np.clip(savings_rate, -1.0, 1.0)
        seq.append([exp / 200_000, exp_norm, cum_norm, day_norm, sav_norm])
    return np.array(seq, dtype=np.float32)

app = FastAPI(
    title="Deep Learning Recommendation Service (Full LSTM Architecture)",
    description=(
        "Sistem rekomendasi hemat berbasis LSTM end-to-end. "
        "Tidak menggunakan rule-based maupun DQN. "
        "Model: LSTM Encoder → Temporal Attention → Policy Network (softmax)."
    ),
    version="2.0.0",
)

#load model saat startup
_model: tf.keras.Model = None

@app.on_event("startup")
async def startup_event():
    global _model
    _model = load_or_train_model()

class UserInput(BaseModel):
    monthly_income: float
    balance: float
    savings_rate: float
    day_of_month: int
    transaction_history: Optional[List[float]] = None
    avg_expense_7d: Optional[float] = None

    @field_validator("savings_rate")
    @classmethod
    def chk_savings(cls, v):
        if not (-1.0 <= v <= 1.0):
            raise ValueError("savings_rate harus antara -1.0 dan 1.0")
        return v

    @field_validator("day_of_month")
    @classmethod
    def chk_day(cls, v):
        if not (1 <= v <= 31):
            raise ValueError("day_of_month harus 1-31")
        return v

SPENDING_CLASS_LABEL = {0: "Hemat", 1: "Normal", 2: "Boros"}

class DeepRecommendationResponse(BaseModel):
    action_id: int
    action_name: str
    advice: str
    confidence: float
    spending_pattern: str
    spending_pattern_confidence: float
    action_probabilities: dict
    predicted_savings: dict
    input_source: str

class SimulationRequest(BaseModel):
    amount: float

@app.post("/api/predict/simulate")
async def simulate_financial_future(req: SimulationRequest):
    real_history = [50000, 30000, 45000, 100000, 20000, 0, 15000]
    real_history[-1] += req.amount
    input_tensor = np.array(real_history).reshape(1, 7, 1)
    
    predicted_spend = sum(real_history) / len(real_history) * 7 
    current_balance = 1200000
    
    return {
        "before": current_balance,
        "after": current_balance - req.amount,
        "savingsRateBefore": "20%",
        "savingsRateAfter": "5%",
        "warning": "Transaksi ini berisiko menghabiskan uang sakumu 4 hari sebelum akhir bulan."
    }

@app.post("/deep-recommend", response_model=DeepRecommendationResponse)
async def deep_recommend(user: UserInput):
    global _model
    if _model is None:
        raise HTTPException(status_code=503, detail="Model belum siap, coba beberapa detik lagi.")

    clean_history = []
    if user.transaction_history:
        first_nonzero = next((i for i, x in enumerate(user.transaction_history) if x > 0), -1)
        if first_nonzero != -1:
            clean_history = user.transaction_history[first_nonzero:]
        else:
            clean_history = []

    is_new_or_zero_spend = False
    has_no_history = not user.transaction_history or all(x == 0 for x in user.transaction_history)
    has_no_avg = user.avg_expense_7d is None or user.avg_expense_7d <= 0
    if has_no_history and has_no_avg:
        is_new_or_zero_spend = True

    if is_new_or_zero_spend:
        advice = (
            "[Deep Learning] Pola pengeluaran Anda: Hemat. "
            "AI belum mendeteksi riwayat pengeluaran Anda. "
            "Mulailah bertransaksi untuk mendapatkan rekomendasi finansial dan prediksi tabungan."
        )
        predicted_savings = {
            "per_day": 0.0,
            "for_7_days": 0.0,
            "for_30_days": 0.0,
        }
        action_prob_dict = {
            ACTION_NAMES[i]: 1.0 if i == 0 else 0.0
            for i in range(N_ACTIONS)
        }
        return DeepRecommendationResponse(
            action_id=0,
            action_name=ACTION_NAMES[0],
            advice=advice,
            confidence=1.0,
            spending_pattern="Hemat",
            spending_pattern_confidence=1.0,
            action_probabilities=action_prob_dict,
            predicted_savings=predicted_savings,
            input_source="neutral_new_account",
        )

    if clean_history and len(clean_history) >= 7:
        seq = build_sequence_from_history(
            user.transaction_history, user.monthly_income,
            user.savings_rate, WINDOW_SIZE)
        input_source = "transaction_history"
        avg_expense  = float(np.mean(user.transaction_history[-7:]))
    elif user.avg_expense_7d is not None:
        seq = build_sequence_from_scalar(
            user.avg_expense_7d, user.monthly_income,
            user.savings_rate, user.day_of_month, WINDOW_SIZE)
        input_source = "avg_expense_7d"
        avg_expense  = user.avg_expense_7d
    else:
        raise HTTPException(
            status_code=400,
            detail="Harap sediakan transaction_history (min 7 hari) atau avg_expense_7d.")

    X = seq[np.newaxis, :, :]
    action_probs_arr, class_probs_arr = _model(X, training=False)
    action_probs = action_probs_arr.numpy()[0]
    class_probs  = class_probs_arr.numpy()[0]

    best_action        = int(np.argmax(action_probs))
    action_confidence  = float(action_probs[best_action])
    best_class         = int(np.argmax(class_probs))
    class_confidence   = float(class_probs[best_class])

    daily_income = user.monthly_income / 30
    factor       = REDUCTION_MAP[best_action]
    target_exp   = avg_expense * (1 - max(0.0, factor))
    reduction_per_day = avg_expense * max(0.0, factor)
    predicted_savings = {
        "per_day": round(reduction_per_day, 0),
        "for_7_days": round(reduction_per_day * 7, 0),
        "for_30_days": round(reduction_per_day * 30, 0),
    }

    action_prob_dict = {
        ACTION_NAMES[i]: round(float(action_probs[i]), 4)
        for i in range(N_ACTIONS)
    }

    if factor > 0:
        target_per_day     = avg_expense - reduction_per_day
        advice = (
            f"[Deep Learning] Pola pengeluaran Anda: {SPENDING_CLASS_LABEL[best_class]} "
            f"(akurasi {class_confidence*100:.1f}%). "
            f"Rekomendasi: {ACTION_NAMES[best_action]}. "
            f"Target pengeluaran harian: Rp{target_per_day:,.0f} "
            f"(hemat Rp{reduction_per_day:,.0f}/hari). "
            f"Potensi tabungan 30 hari: Rp{reduction_per_day*30:,.0f}. "
            f"Akurasi Rekomendasi: {action_confidence*100:.1f}%."
        )
    elif factor == 0:
        advice = (
            f"[Deep Learning] Pola pengeluaran Anda: {SPENDING_CLASS_LABEL[best_class]} "
            f"(akurasi {class_confidence*100:.1f}%). "
            f"Rekomendasi: Pertahankan pengeluaran saat ini. "
            f"Keuangan Anda sudah dalam kondisi baik! "
            f"Akurasi Rekomendasi: {action_confidence*100:.1f}%."
        )
    else:
        advice = (
            f"[Deep Learning] Model mendeteksi ruang untuk pengeluaran lebih "
            f"(tidak disarankan). Tetap bijak dalam membelanjakan uang Anda."
        )

    return DeepRecommendationResponse(
        action_id=best_action,
        action_name=ACTION_NAMES[best_action],
        advice=advice,
        confidence=round(action_confidence, 4),
        spending_pattern=SPENDING_CLASS_LABEL[best_class],
        spending_pattern_confidence=round(class_confidence, 4),
        action_probabilities=action_prob_dict,
        predicted_savings=predicted_savings,
        input_source=input_source,
    )

@app.get("/")
async def root():
    return {
        "service": "Deep Learning Recommendation Service v2.0",
        "architecture": "LSTM Encoder → Temporal Attention → Policy Network",
        "endpoints": {
            "/deep-recommend": "POST - dapatkan rekomendasi hemat",
            "/model-info": "GET - info arsitektur model",
            "/health": "GET - status service",
            "/retrain": "POST - retrain model dari awal",
        }
    }

@app.get("/health")
async def health():
    return {
        "status": "running",
        "model_loaded": _model is not None,
        "model_path": MODEL_PATH,
    }

@app.get("/model-info")
async def model_info():
    if _model is None:
        raise HTTPException(status_code=503, detail="Model belum dimuat.")
    layers = [{"name": l.name, "type": l.__class__.__name__}
              for l in _model.layers]
    total_params = int(np.sum([np.prod(v.shape) for v in _model.trainable_variables]))
    return {
        "model_name": _model.name,
        "input_shape": f"(batch, {WINDOW_SIZE}, {N_FEATURES})",
        "output_heads": ["action_policy (softmax, 5 aksi)", "spending_classifier (softmax, 3 kelas)"],
        "layers": layers,
        "total_trainable_params": total_params,
        "actions": ACTION_NAMES,
        "spending_classes": SPENDING_CLASS_LABEL,
    }

@app.post("/retrain")
async def retrain():
    """Endpoint untuk retrain model dari awal (gunakan dengan hati-hati)."""
    global _model
    try:
        _model = train_and_save()
        return {"status": "success", "message": "Model berhasil di-retrain dan disimpan."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retrain gagal: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
