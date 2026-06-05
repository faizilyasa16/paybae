# PayBae 💸

PayBae adalah aplikasi manajemen keuangan dan dompet digital pintar yang dilengkapi dengan fitur Artificial Intelligence (AI) untuk membantu pengguna mengelola keuangan dengan lebih mudah, cepat, dan cerdas. Aplikasi ini menyediakan fitur pelacakan pengeluaran, transfer saldo, pembayaran QRIS, pencatatan transaksi otomatis melalui AI Scan Receipt, hingga analisis dan prediksi keuangan masa depan menggunakan teknologi Machine Learning.

PayBae dirancang dengan tampilan modern, responsif, dan user-friendly sehingga dapat digunakan dengan nyaman baik pada desktop maupun perangkat mobile.

---

# 🚀 Panduan Menjalankan Aplikasi (Local Development)

Untuk menjalankan aplikasi PayBae di komputer Anda, ikuti langkah-langkah berikut:

## 📋 Prasyarat

Pastikan perangkat Anda sudah terinstall:

* PHP minimal versi 8.1
* Composer
* Node.js & npm
* Database MySQL / PostgreSQL

---

# ⚙️ Langkah Instalasi

## 1. Clone Repository

```bash
git clone <url-repo-paybae>
cd PAYBAE
```

## 2. Install Dependensi PHP

```bash
composer install
```

## 3. Install Dependensi JavaScript

```bash
npm install
```

## 4. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`

```bash
cp .env.example .env
```

Kemudian buka file `.env` dan sesuaikan konfigurasi database seperti:

```env
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
```

Tambahkan juga konfigurasi lain yang diperlukan sesuai environment aplikasi.

---

## 5. Generate Application Key

```bash
php artisan key:generate
```

---

## 6. Migrasi Database

```bash
php artisan migrate
```

---

## 7. Jalankan Aplikasi

Aplikasi PayBae membutuhkan backend Laravel dan frontend React/Vite berjalan secara bersamaan.

### Terminal 1 — Laravel Backend

```bash
php artisan serve
```

### Terminal 2 — Vite Frontend

```bash
npm run dev
```

---

## 8. Akses Aplikasi

Buka browser dan akses:

```txt
http://localhost:8000
```

---

# 🤖 Model AI & Machine Learning

PayBae dilengkapi dengan sistem Artificial Intelligence (AI) untuk membantu pengguna memahami pola keuangan mereka secara otomatis dan memberikan rekomendasi finansial yang lebih cerdas.

## 🔍 Teknologi AI yang Digunakan

Model AI pada PayBae digunakan untuk:

* Menganalisis pola pengeluaran pengguna
* Mengklasifikasikan tingkat kesehatan finansial pengguna
* Memberikan rekomendasi penghematan otomatis
* Memprediksi potensi tabungan di masa depan
* Membantu fitur simulasi keuangan “Time Machine”

---

## 🧠 Model Machine Learning

PayBae menggunakan beberapa pendekatan Machine Learning untuk meningkatkan akurasi analisis keuangan, di antaranya:

* Deep Learning
* Random Forest
* XGBoost

Model AI akan membaca histori transaksi pengguna seperti:

* Total pemasukan
* Total pengeluaran
* Frekuensi transaksi
* Pola penggunaan saldo
* Aktivitas finansial mingguan

Kemudian AI akan menghasilkan status keuangan seperti:

* Sangat Hemat
* Hemat
* Normal
* Boros
* Sangat Boros

Beserta rekomendasi personal berdasarkan kebiasaan finansial pengguna.

---

# 📊 Dataset & Model AI

Berikut model AI yang digunakan pada sistem PayBae:

## Model AI 1

Google Drive:
https://drive.google.com/file/d/18R1AiUip87hYGqnLpC0uRmCobIvielb7/view?usp=drive_link

## Model AI 2

Google Drive:
https://drive.google.com/file/d/1ZJBbi44IYlhmOrroihGYtw6FsG7i_i4Z/view?usp=drive_link

---

# ⚡ Cara Kerja AI di PayBae

1. Sistem membaca data transaksi pengguna
2. Data diproses oleh model Machine Learning
3. AI melakukan prediksi perilaku finansial
4. Sistem menghasilkan:

   * Prediksi pengeluaran
   * Prediksi tabungan
   * Status finansial pengguna
   * Rekomendasi penghematan

Fitur AI ini berjalan secara otomatis pada Dashboard dan fitur “Time Machine”.

---

# 📱 Panduan Penggunaan Fitur PayBae

Berikut langkah-langkah menggunakan fitur utama di dalam aplikasi PayBae:

---

## 1. Pendaftaran dan Masuk (Autentikasi)

* Buka halaman utama aplikasi
* Klik tombol **Masuk / Daftar**
* Jika belum memiliki akun, lakukan registrasi
* Jika sudah memiliki akun, login menggunakan email dan password

---

## 2. Dashboard Keuangan

Setelah berhasil login, pengguna akan diarahkan ke halaman Dashboard.

Pada halaman ini pengguna dapat melihat:

* Total saldo
* Pemasukan bulan ini
* Pengeluaran bulan ini
* Riwayat transaksi terbaru
* Prediksi AI dan rekomendasi keuangan

Dashboard juga mendukung fitur:

* Dark Mode
* Light Mode
* Interactive Financial Analysis

---

## 3. Scan QRIS (Pembayaran Cepat)

Fitur QRIS digunakan untuk melakukan pembayaran digital secara cepat.

Cara penggunaan:

1. Buka menu **Scan QRIS**
2. Izinkan akses kamera
3. Arahkan kamera ke QR Code merchant
4. Masukkan nominal pembayaran
5. Konfirmasi pembayaran

Saldo akan otomatis terpotong sesuai nominal transaksi.

---

## 4. Scan Struk AI (AI Receipt Scanner)

Fitur ini memanfaatkan teknologi AI untuk membaca informasi dari foto struk belanja.

Langkah penggunaan:

1. Masuk ke menu **Scan Struk**
2. Ambil foto struk atau upload gambar
3. AI akan memproses data secara otomatis
4. Sistem akan mendeteksi:

   * Total belanja
   * Nama toko
   * Informasi transaksi
5. Simpan hasil transaksi ke riwayat pengeluaran

Fitur ini membantu pengguna mencatat pengeluaran tanpa input manual.

---

## 5. Transfer Saldo

Pengguna dapat melakukan transfer saldo antar akun.

Langkah penggunaan:

1. Buka menu **Transfer**
2. Masukkan tujuan transfer
3. Input nominal transfer
4. Konfirmasi transaksi

---

## 6. Top Up Saldo

Untuk menambahkan saldo ke akun PayBae:

1. Masuk ke menu **Top Up**
2. Pilih metode pembayaran
3. Masukkan nominal top up
4. Selesaikan pembayaran

Saldo akan otomatis masuk setelah pembayaran berhasil.

---

## 7. Fitur “Time Machine”

Time Machine adalah fitur simulasi dan prediksi keuangan berbasis AI.

Fitur ini dapat:

* Menganalisis kesehatan finansial pengguna
* Memberikan status finansial
* Memberikan rekomendasi penghematan
* Memprediksi tabungan masa depan

Status yang dapat dihasilkan AI:

* Sangat Hemat
* Hemat
* Normal
* Boros
* Sangat Boros

Fitur ini membantu pengguna mengambil keputusan finansial yang lebih baik sebelum melakukan pengeluaran.

---

# 🛡️ Keamanan Data

PayBae dirancang dengan memperhatikan keamanan data pengguna. Seluruh transaksi dan proses analisis AI dilakukan secara aman untuk menjaga privasi pengguna.

Data transaksi hanya digunakan untuk kebutuhan sistem dan analisis finansial internal aplikasi.

---

# ✨ Teknologi yang Digunakan

Frontend:

* React.js
* Inertia.js
* Tailwind CSS
* Vite

Backend:

* Laravel

Database:

* MySQL / PostgreSQL

Artificial Intelligence:

* Deep Learning
* Random Forest
* XGBoost

Payment:

* QRIS Integration

---

# 👨‍💻 Developer

PayBae dikembangkan sebagai aplikasi financial technology modern yang menggabungkan teknologi web dan Artificial Intelligence untuk membantu pengguna mengelola keuangan secara lebih cerdas dan efisien.
