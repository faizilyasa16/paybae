# PayBae 💸

PayBae adalah aplikasi manajemen keuangan dan dompet digital pintar yang dilengkapi dengan fitur AI untuk memudahkan Anda melacak pengeluaran, membayar dengan QRIS, dan memprediksi keuangan Anda di masa depan.

## 🚀 Panduan Menjalankan Aplikasi (Local Development)

Untuk menjalankan PayBae di komputer Anda, ikuti langkah-langkah berikut:

### Prasyarat
Pastikan Anda sudah menginstal:
- PHP (minimal versi 8.1)
- Composer
- Node.js & npm
- Database MySQL / PostgreSQL

### Langkah Instalasi

1. **Clone Repository (Jika belum)**
   ```bash
   git clone <url-repo-paybae>
   cd PAYBAE
   ```

2. **Install Dependensi PHP**
   ```bash
   composer install
   ```

3. **Install Dependensi JavaScript**
   ```bash
   npm install
   ```

4. **Konfigurasi Environment**
   Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Buka file `.env` dan sesuaikan konfigurasi database (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`) serta masukkan konfigurasi tambahan yang diperlukan.

5. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```

6. **Migrasi Database**
   ```bash
   php artisan migrate
   ```

7. **Jalankan Aplikasi**
   Anda perlu menjalankan server backend (Laravel) dan frontend (Vite/React) secara bersamaan.

   Terminal 1 (Backend Laravel):
   ```bash
   php artisan serve
   ```

   Terminal 2 (Frontend Vite):
   ```bash
   npm run dev
   ```

8. **Akses Aplikasi**
   Buka browser dan akses: `http://localhost:8000`

---

## 📱 Panduan Penggunaan Fitur PayBae

Berikut adalah langkah-langkah untuk menggunakan fitur-fitur utama di dalam aplikasi PayBae:

### 1. Pendaftaran dan Masuk (Autentikasi)
- Buka halaman utama aplikasi.
- Klik tombol **Masuk / Daftar** di bilah navigasi (navbar).
- Jika Anda pengguna baru, isi formulir pendaftaran dengan data diri Anda.
- Jika sudah memiliki akun, masuk menggunakan email dan kata sandi Anda.

### 2. Membaca Dashboard
- Setelah berhasil masuk, Anda akan langsung diarahkan ke halaman **Dashboard**.
- Di bagian atas, Anda dapat melihat informasi saldo: **Total Saldo**, **Pengeluaran Bulan Ini**, dan **Pemasukan Bulan Ini**.
- Di bagian bawah dashboard, Anda dapat melihat daftar **Riwayat Transaksi** terbaru Anda.
- Anda dapat mengaktifkan **Mode Gelap (Dark Mode)** atau **Mode Terang (Light Mode)** untuk kenyamanan mata.

### 3. Scan QRIS (Pembayaran Cepat)
- Di halaman Dashboard atau navigasi utama, pilih menu **Scan QRIS**.
- Berikan izin pada browser/aplikasi untuk mengakses kamera perangkat Anda.
- Arahkan kamera ke kode QRIS merchant.
- Setelah QRIS berhasil dipindai, masukkan nominal pembayaran (jika tidak otomatis ditentukan) lalu konfirmasi.
- Saldo Anda akan otomatis terpotong sesuai dengan nominal pembayaran.

### 4. Scan Struk AI (Pencatatan Otomatis dengan AI)
- Fitur ini sangat berguna untuk mencatat pengeluaran tanpa perlu mengetik manual. Aplikasi menggunakan teknologi AI untuk mengekstrak informasi dari struk fisik.
- Masuk ke menu **Scan Struk**.
- Gunakan kamera untuk memfoto struk belanja Anda, atau unggah foto struk dari galeri.
- AI akan memproses gambar dan menarik informasi penting seperti **Total Belanja** dan **Nama Toko**.
- Periksa kembali hasil pemindaian AI. Jika sudah sesuai, Anda dapat langsung menyimpannya sebagai pengeluaran ke dalam riwayat transaksi Anda.

### 5. Transfer Saldo
- Akses menu **Transfer** melalui dashboard.
- Masukkan detail tujuan transfer (misalnya, nomor rekening, nomor telepon, atau akun pengguna lain).
- Masukkan jumlah nominal yang ingin ditransfer.
- Periksa kembali detail transfer dan klik tombol konfirmasi.

### 6. Top Up Saldo
- Akses menu **Top Up** untuk menambahkan dana ke akun PayBae Anda.
- Pilih metode pembayaran yang tersedia (transfer bank, e-wallet lain, dll).
- Masukkan jumlah top-up yang diinginkan.
- Selesaikan proses pembayaran sesuai dengan metode yang Anda pilih hingga saldo masuk.

### 7. Fitur "Time Machine" (Analisis & Prediksi Keuangan)
- Fitur ini memberikan analisis cerdas (rekomendasi berbasis AI) mengenai pola pengeluaran Anda.
- Buka menu atau modal **Time Machine** yang tersedia di halaman Dashboard.
- AI akan memberikan ulasan tingkat kesehatan keuangan Anda (misal: "boros", "normal", "hemat") berdasarkan data pengeluaran dan pemasukan bulan ini.
- Manfaatkan rekomendasi yang diberikan oleh fitur ini untuk merencanakan tabungan dan mengatur pengeluaran Anda di bulan berikutnya.
