import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings
warnings.filterwarnings('ignore')

print("-"*50)
print("LOADING DAN PREPROCESSING DATA")
print("-"*50)
 
df = pd.read_csv('dataset_feature_engineering10thninflasi.csv')
df['Date'] = pd.to_datetime(df['Date'])
df = df.sort_values('Date').reset_index(drop=True)
 
target_column = 'total_pengeluaran'

outlier_threshold = 200000
median_value = df[df[target_column] <= outlier_threshold][target_column].median()
df[target_column] = df[target_column].apply(lambda x: median_value if x > outlier_threshold else x)
 
print(f"Data shape: {df.shape}")
print(f"Range data: Rp {df[target_column].min():,.0f} - Rp {df[target_column].max():,.0f}")
 
print("\n" + "-"*50)
print("FEATURE SELECTION")
print("-"*50)
 
feature_columns = [
    'pengeluaran_1sebelumnya', 'pengeluaran_3sebelumnya',
    'pengeluaran_7sebelumnya', 'pengeluaran_14sebelumnya',
    'rata-rata_3hari', 'rata-rata_7hari', 'rata-rata_30hari',
    'std_seminggu', 'std_sebulan', 'ema_7',
    'is_payday', 'weekend_encoded'
]
feature_columns = [col for col in feature_columns if col in df.columns]
 
print(f"\nFitur yang digunakan ({len(feature_columns)} fitur):")
for f in feature_columns:
    print(f"  - {f}")

print("\n" + "-"*50)
print("PREPARE DATA")
print("-"*50)
 
df_clean = df.dropna().reset_index(drop=True)
print(f"Data setelah drop NaN: {len(df_clean)} rows")
 
X = df_clean[feature_columns].values.astype(np.float32)
y = df_clean[target_column].values.astype(np.float32)
 
WINDOW_SIZE = 7
FORECAST_HORIZON = 7
 
def create_sequences(X, y, window_size=7, forecast_horizon=7):
    X_seq, y_seq = [], []
    for i in range(len(X) - window_size - forecast_horizon + 1):
        X_seq.append(X[i:i+window_size])
        y_seq.append(y[i+window_size:i+window_size+forecast_horizon])
    return np.array(X_seq, dtype=np.float32), np.array(y_seq, dtype=np.float32)
 
split_idx_raw = int(len(X) * 0.8)
X_train_raw = X[:split_idx_raw]
X_test_raw  = X[split_idx_raw:]
y_train_raw = y[:split_idx_raw]
y_test_raw  = y[split_idx_raw:]

scaler_X = MinMaxScaler()
scaler_y = MinMaxScaler()
scaler_X.fit(X_train_raw)
scaler_y.fit(y_train_raw.reshape(-1, 1))
 
X_train_scaled = scaler_X.transform(X_train_raw)
X_test_scaled  = scaler_X.transform(X_test_raw)
y_train_scaled = scaler_y.transform(y_train_raw.reshape(-1, 1)).flatten()
y_test_scaled  = scaler_y.transform(y_test_raw.reshape(-1, 1)).flatten()
 
X_train_seq, y_train_seq = create_sequences(X_train_scaled, y_train_scaled, WINDOW_SIZE, FORECAST_HORIZON)
X_test_seq,  y_test_seq  = create_sequences(X_test_scaled,  y_test_scaled,  WINDOW_SIZE, FORECAST_HORIZON)
 
print(f"Train: X={X_train_seq.shape}, y={y_train_seq.shape}")
print(f"Test : X={X_test_seq.shape}, y={y_test_seq.shape}")
 
print("\n" + "-"*50)
print("PREPARE DATA UNTUK RANDOM FOREST")
print("-"*50)

def create_rf_features(X_seq):
    n_samples  = X_seq.shape[0]
    window     = X_seq.shape[1]
    n_features = X_seq.shape[2]
    return X_seq.reshape(n_samples, window * n_features) 
X_train_rf = create_rf_features(X_train_seq)
X_test_rf  = create_rf_features(X_test_seq)
print(f"X_train_rf shape: {X_train_rf.shape}")
print(f"X_test_rf  shape: {X_test_rf.shape}")

print("\n" + "-"*50)
print("TRAINING RANDOM FOREST")
print("-"*50)
 
rf_models = []
rf_predictions = np.zeros((X_test_rf.shape[0], FORECAST_HORIZON))
 
print(f"Melatih {FORECAST_HORIZON} model RF (satu per hari prediksi)...")
for h in range(FORECAST_HORIZON):
    print(f"  Training hari ke-{h+1}...")
    rf = RandomForestRegressor(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    rf.fit(X_train_rf, y_train_seq[:, h])
    rf_models.append(rf)
    rf_predictions[:, h] = rf.predict(X_test_rf)
 
print(" Random Forest training selesai!")

class AttentionLayer(tf.keras.layers.Layer):
    def __init__(self, units=32, **kwargs):
        super(AttentionLayer, self).__init__(**kwargs)
        self.units = units

    def build(self, input_shape):
        self.W = self.add_weight(name='attention_weight', shape=(input_shape[-1], self.units),initializer='glorot_uniform', trainable=True)
        self.b = self.add_weight(name='attention_bias', shape=(self.units,),initializer='zeros', trainable=True)
        self.u = self.add_weight(name='context_vector', shape=(self.units, 1), initializer='glorot_uniform', trainable=True)
        super().build(input_shape)
 
    def call(self, inputs):
        score = tf.nn.tanh(tf.tensordot(inputs, self.W, axes=1) + self.b)
        attention_weights = tf.nn.softmax(tf.tensordot(score, self.u, axes=1), axis=1)
        output = tf.reduce_sum(inputs * attention_weights, axis=1)
        return output
 
    def get_config(self):
        config = super().get_config()
        config.update({'units': self.units})
        return config

print("\n" + "-"*50)
print("BUILD HYBRID MODEL (LSTM + RF PREDICTIONS)")
print("-"*50)
 
def build_hybrid_model(input_shape, forecast_horizon=7, dropout_rate=0.2):
    sequence_input = Input(shape=input_shape, dtype=tf.float32, name='sequence_input')
    x = LSTM(64, return_sequences=True, activation='tanh')(sequence_input)
    x = Dropout(dropout_rate)(x)
    x = LSTM(32, return_sequences=True, activation='tanh')(x)
    x = Dropout(dropout_rate)(x)
    x = AttentionLayer(units=16)(x)
    x = Dense(32, activation='relu')(x)
    x = Dropout(dropout_rate)(x)
    x = Dense(16, activation='relu')(x)
    output = Dense(forecast_horizon, name='lstm_output')(x)
    return Model(inputs=sequence_input, outputs=output)
 
input_shape  = (WINDOW_SIZE, len(feature_columns))
hybrid_model = build_hybrid_model(input_shape, FORECAST_HORIZON, dropout_rate=0.2)
hybrid_model.summary()

print("\n" + "-"*50)
print("CUSTOM TRAINING LOOP FOR HYBRID MODEL")
print("-"*50)

class HybridTrainer:
    def __init__(self, model, learning_rate=0.001):
        self.model      = model
        self.optimizer  = Adam(learning_rate=learning_rate, clipnorm=1.0)
        self.train_loss = tf.keras.metrics.Mean(name='train_loss')
        self.val_loss   = tf.keras.metrics.Mean(name='val_loss')
        self.train_mae  = tf.keras.metrics.MeanAbsoluteError(name='train_mae')
        self.val_mae    = tf.keras.metrics.MeanAbsoluteError(name='val_mae')
        self.history    = {'train_loss': [], 'val_loss': [], 'train_mae': [], 'val_mae': []}
        self.best_weights = model.get_weights()
        
        import os
        import datetime
        os.makedirs("logs/fit", exist_ok=True)
        log_dir = "logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        self.summary_writer = tf.summary.create_file_writer(log_dir)

    @tf.function
    def train_step(self, x, y):
        x = tf.cast(x, tf.float32)
        y = tf.cast(y, tf.float32)
        with tf.GradientTape() as tape:
            predictions = self.model(x, training=True)
            predictions = tf.cast(predictions, tf.float32)
            loss = tf.reduce_mean(tf.square(y - predictions))
        gradients = tape.gradient(loss, self.model.trainable_variables)
        gradients = [tf.clip_by_norm(g, 1.0) if g is not None else g for g in gradients]
        self.optimizer.apply_gradients(zip(gradients, self.model.trainable_variables))
        self.train_loss.update_state(loss)
        self.train_mae.update_state(y, predictions)
        return loss

    @tf.function
    def val_step(self, x, y):
        x = tf.cast(x, tf.float32)
        y = tf.cast(y, tf.float32)
        predictions = self.model(x, training=False)
        predictions = tf.cast(predictions, tf.float32)
        loss = tf.reduce_mean(tf.square(y - predictions))
        self.val_loss.update_state(loss)
        self.val_mae.update_state(y, predictions)
        return loss, predictions

    def train(self, X_train, y_train, X_test, y_test,
              epochs=100, batch_size=32, patience=15, verbose=1):
        X_train = tf.convert_to_tensor(X_train, dtype=tf.float32)
        y_train = tf.convert_to_tensor(y_train, dtype=tf.float32)
        X_test = tf.convert_to_tensor(X_test, dtype=tf.float32)
        y_test = tf.convert_to_tensor(y_test, dtype=tf.float32)

        train_ds = (tf.data.Dataset.from_tensor_slices((X_train, y_train)).shuffle(500).batch(batch_size).prefetch(tf.data.AUTOTUNE))
        test_ds = tf.data.Dataset.from_tensor_slices((X_test, y_test)).batch(batch_size)

        best_val_loss = float('inf')
        patience_counter = 0

        print("\n" + "-"*40)
        print("MULAI TRAINING HYBRID MODEL")
        print("-"*40)

        for epoch in range(epochs):
            self.train_loss.reset_state()
            self.val_loss.reset_state()
            self.train_mae.reset_state()
            self.val_mae.reset_state()

            for bx, by in train_ds:
                self.train_step(bx, by)
            for bx, by in test_ds:
                self.val_step(bx, by)
 
            tl = self.train_loss.result().numpy()
            vl = self.val_loss.result().numpy()
            tma = self.train_mae.result().numpy()
            vma = self.val_mae.result().numpy()

            self.history['train_loss'].append(tl)
            self.history['val_loss'].append(vl)
            self.history['train_mae'].append(tma)
            self.history['val_mae'].append(vma)

            with self.summary_writer.as_default():
                tf.summary.scalar('train_loss', tl, step=epoch)
                tf.summary.scalar('val_loss', vl, step=epoch)
                tf.summary.scalar('train_mae', tma, step=epoch)
                tf.summary.scalar('val_mae', vma, step=epoch)

            if vl < best_val_loss:
                best_val_loss = vl
                patience_counter = 0
                self.best_weights = self.model.get_weights()
            else:
                patience_counter += 1

            if verbose and (epoch + 1) % 10 == 0:
                lr = float(self.optimizer.learning_rate)
                print(f"Epoch {epoch+1}/{epochs} - LR: {lr:.6f} - "
                      f"Train Loss: {tl:.6f} - Val Loss: {vl:.6f} - "
                      f"Train MAE: {tma:.4f} - Val MAE: {vma:.4f}")
 
            if patience_counter >= patience:
                print(f"\n! Early stopping at epoch {epoch+1}")
                break

        self.model.set_weights(self.best_weights)
        print(f"\n Training selesai! Best val loss: {best_val_loss:.6f}")
        return self.history
 
trainer = HybridTrainer(hybrid_model, learning_rate=0.0005)
history = trainer.train(X_train_seq, y_train_seq, X_test_seq, y_test_seq,
                        epochs=100, batch_size=32, patience=15, verbose=1)

print("\n" + "="*50)
print("OPTIMASI BOBOT ENSEMBLE")
print("="*50)

lstm_pred_scaled = hybrid_model.predict(X_test_seq)
rf_pred_scaled   = rf_predictions

best_mae_ensemble = float('inf')
best_w_rf = 0.5

for w_rf in np.arange(0.0, 1.05, 0.05):
    w_lstm = 1.0 - w_rf
    ens_scaled = w_rf * rf_pred_scaled + w_lstm * lstm_pred_scaled
    ens_orig_flat = scaler_y.inverse_transform(ens_scaled.reshape(-1, 1)).flatten()
    y_true_flat = scaler_y.inverse_transform(y_test_seq.reshape(-1, 1)).flatten()
    mae_val = mean_absolute_error(y_true_flat, np.maximum(ens_orig_flat, 0))
    if mae_val < best_mae_ensemble:
        best_mae_ensemble = mae_val
        best_w_rf = w_rf

best_w_lstm = 1.0 - best_w_rf
print(f"Bobot optimal  -> RF: {best_w_rf:.2f}, LSTM: {best_w_lstm:.2f}")
print(f"MAE ensemble terbaik: Rp {best_mae_ensemble:,.0f}")

ensemble_pred_scaled = best_w_rf * rf_pred_scaled + best_w_lstm * lstm_pred_scaled

print("\n" + "-"*50)
print("EVALUASI MODEL (COMPARE 3 MODEL)")
print("-"*50)

def inverse_transform_predictions(pred_scaled, scaler):
    return scaler.inverse_transform(
        pred_scaled.reshape(-1, 1)
    ).flatten().reshape(-1, FORECAST_HORIZON)
 
y_true_orig = inverse_transform_predictions(y_test_seq, scaler_y)
rf_pred_orig = inverse_transform_predictions(rf_pred_scaled, scaler_y)
lstm_pred_orig = inverse_transform_predictions(lstm_pred_scaled, scaler_y)
ens_pred_orig = inverse_transform_predictions(ensemble_pred_scaled, scaler_y)

rf_pred_orig = np.maximum(rf_pred_orig, 0)
lstm_pred_orig = np.maximum(lstm_pred_orig, 0)
ens_pred_orig = np.maximum(ens_pred_orig, 0)

def evaluate_model(y_true, y_pred, y_true_scaled, y_pred_scaled, name="Model"):
    yt = y_true.flatten()
    yp = y_pred.flatten()
    mae = mean_absolute_error(yt, yp)
    rmse = np.sqrt(mean_squared_error(yt, yp))
    r2 = r2_score(yt, yp)
    mask = yt != 0
    mape = np.mean(np.abs((yt[mask] - yp[mask]) / yt[mask])) * 100 if mask.any() else 0
    mae_scaled = mean_absolute_error(y_true_scaled.flatten(), y_pred_scaled.flatten())
    return {'mae': mae, 'rmse': rmse, 'r2': r2, 'mape': mape, 'mae_scaled': mae_scaled}


rf_metrics = evaluate_model(y_true_orig, rf_pred_orig, y_test_seq, rf_pred_scaled, "Random Forest")
lstm_metrics = evaluate_model(y_true_orig, lstm_pred_orig, y_test_seq, lstm_pred_scaled, "LSTM")
ens_metrics = evaluate_model(y_true_orig, ens_pred_orig, y_test_seq, ensemble_pred_scaled, "Ensemble (RF + LSTM)")

print(f"\n{'Model':<25} {'MAE (Rp)':<15} {'RMSE (Rp)':<15} {'MAPE (%)':<12} {'R²':<10}")
print("-" * 80)
for name, m in [("Random Forest", rf_metrics), ("LSTM", lstm_metrics), ("Ensemble (RF+LSTM)", ens_metrics)]:
    print(f"{name:<25} Rp {m['mae']:>10,.0f}   Rp {m['rmse']:>10,.0f}   {m['mape']:>9.2f}%   {m['r2']:>8.4f}")
print("-" * 80)

best_mae = min(rf_metrics['mae'], lstm_metrics['mae'], ens_metrics['mae'])
if best_mae == rf_metrics['mae']: 
    best_model, best_pred_orig, best_m = "Random Forest", rf_pred_orig, rf_metrics
elif best_mae == lstm_metrics['mae']: 
    best_model, best_pred_orig, best_m = "LSTM", lstm_pred_orig, lstm_metrics
else: 
    best_model, best_pred_orig, best_m = "Ensemble (RF+LSTM)", ens_pred_orig, ens_metrics

print(f"\n Model terbaik berdasarkan MAE: {best_model}")

print("\n" + "="*50)
print(f"PREDIKSI 7 HARI KE DEPAN ({best_model})")
print("="*50)
 
def predict_next_7_days(model, rf_models, df_clean, feature_columns,
                         scaler_X, scaler_y, w_rf, w_lstm,
                         window_size=7, forecast_horizon=7):
    last_window        = df_clean[feature_columns].values[-window_size:].astype(np.float32)
    last_window_scaled = scaler_X.transform(last_window)

    # LSTM prediction
    input_seq = last_window_scaled.reshape(1, window_size, -1)
    lstm_s = model.predict(input_seq, verbose=0)[0]

    # RF prediction
    flat = last_window_scaled.flatten().reshape(1, -1)
    rf_s = np.array([rf.predict(flat)[0] for rf in rf_models])

    # gunakan bobot optimal
    ens_s = w_rf * rf_s + w_lstm * lstm_s
    preds_orig = scaler_y.inverse_transform(ens_s.reshape(-1, 1)).flatten()
    preds_orig = np.maximum(preds_orig, 0)

    last_date = df_clean['Date'].max()
    future_dates = [last_date + pd.Timedelta(days=i+1) for i in range(forecast_horizon)]

    return pd.DataFrame({
        'Date': future_dates,
        'Predicted_Expenditure_Rp': preds_orig
    })

future_predictions = predict_next_7_days(
    hybrid_model, rf_models, df_clean, feature_columns,
    scaler_X, scaler_y, best_w_rf, best_w_lstm
)
total_7_days = future_predictions['Predicted_Expenditure_Rp'].sum()

print("\n" + "-" * 55)
for _, row in future_predictions.iterrows():
    print(f"{row['Date'].strftime('%Y-%m-%d')}: Rp {row['Predicted_Expenditure_Rp']:,.0f}")
print("-" * 55)
print(f"\nTOTAL PENGELUARAN 7 HARI: Rp {total_7_days:,.0f}")
print(f"Rata-rata per hari      : Rp {total_7_days/7:,.0f}")

print("\n" + "="*50)
print("RINGKASAN HASIL SEMUA MODEL")
print("="*50)

all_models = [
    ("Random Forest", rf_metrics),
    ("LSTM", lstm_metrics),
    ("Hybrid (RF + LSTM)", ens_metrics),
]

for model_name, m in all_models:
    label = f" ← BEST MODEL" if model_name.replace("Hybrid (RF + LSTM)", "Ensemble (RF+LSTM)") == best_model or \
            (model_name == "Hybrid (RF + LSTM)" and best_model == "Ensemble (RF+LSTM)") else ""
    print(f"""
{'='*40}
  {model_name}{label}
{'='*40}
  - R-squared (R²)     : {m['r2']:.4f}
  - MAE (Rupiah)       : Rp {m['mae']:,.0f}
  - MAE (Scaled)       : {m['mae_scaled']:.4f}
  - RMSE               : Rp {m['rmse']:,.0f}
  - MAPE               : {m['mape']:.2f}%
  - Akurasi (100-MAPE) : {100 - m['mape']:.2f}%""")

print(f"""
{'='*50}
PREDIKSI 7 HARI KE DEPAN (Hybrid RF + LSTM):
- TOTAL                : Rp {total_7_days:,.0f}
- Rata-rata per hari   : Rp {total_7_days/7:,.0f}
{'='*50}
Model terbaik berdasarkan MAE: {best_model}
""")
 
import joblib
import os
os.makedirs('models', exist_ok=True)

future_predictions.to_csv('Hybrid_RF_LSTM_predictions.csv', index=False)

pd.DataFrame({
    'Model': ['Random Forest', 'LSTM', 'Ensemble (RF+LSTM)'],
    'MAE_Rp': [rf_metrics['mae'], lstm_metrics['mae'], ens_metrics['mae']],
    'MAE_Scaled': [rf_metrics['mae_scaled'], lstm_metrics['mae_scaled'], ens_metrics['mae_scaled']],
    'RMSE_Rp': [rf_metrics['rmse'], lstm_metrics['rmse'], ens_metrics['rmse']],
    'MAPE_%': [rf_metrics['mape'], lstm_metrics['mape'], ens_metrics['mape']],
    'R2': [rf_metrics['r2'], lstm_metrics['r2'], ens_metrics['r2']]
}).to_csv('Model_Comparison.csv', index=False)
 
hybrid_model.save('models/hybrid_model.keras')
joblib.dump(scaler_X, 'models/scaler_X.pkl')
joblib.dump(scaler_y, 'models/scaler_y.pkl')
joblib.dump(rf_models, 'models/rf_models_list.pkl')
joblib.dump({'best_w_rf': best_w_rf, 'best_w_lstm': best_w_lstm}, 'models/ensemble_weights.pkl')

print("\n Hasil dan Model telah berhasil disimpan ke:")
print(" - models/hybrid_model.keras")
print(" - models/scaler_X.pkl")
print(" - models/scaler_y.pkl")
print(" - models/rf_models_list.pkl")
print(" - models/ensemble_weights.pkl")
