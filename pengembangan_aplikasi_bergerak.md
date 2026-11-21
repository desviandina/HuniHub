Panduan FINAL Pengembang Aplikasi Bergerak

Rilis Aplikasi Mobile di HorizonLab.click & Final Pitching

Pendahuluan & Analogi Sederhana

Selamat datang di panduan taktis peluncuran produk digital! Dokumen ini dirancang khusus untuk mahasiswa Bisnis Digital yang ingin mengubah ide bisnis menjadi produk nyata tanpa harus tersesat dalam kerumitan teknis software engineering.

Tujuan utama dari proyek ini adalah melakukan validasi pasar secara langsung menggunakan metode Minimum Viable Product (MVP). Sebelum menginvestasikan waktu dan biaya untuk merilis aplikasi di Google Play Store resmi, kalian akan mempublikasikan aplikasi versi pertama di laboratorium peluncuran sementara horizonlab.click. Platform ini berfungsi sebagai tempat pengujian, pengumpulan umpan balik pengguna, dan penyempurnaan aset pemasaran produk awal kalian.

Untuk memudahkan pemahaman teknis, mari kita gunakan tiga analogi sederhana berikut:

Build APK: Bayangkan proses pembuatan aplikasi seperti memproses adonan roti di dapur. Kode program React Native yang kalian tulis adalah adonan mentahnya. Proses build APK adalah tindakan memanggang adonan tersebut di dalam oven hingga menjadi sepotong roti jadi yang siap dikonsumsi (app-release.apk). File APK inilah yang dapat diunduh dan dipasang secara langsung di ponsel Android pengguna.
Keystore: Ini adalah stempel atau tanda tangan digital resmi milik perusahaan kalian. Sama seperti surat resmi yang membutuhkan stempel basah agar tidak bisa dipalsukan, Keystore memastikan bahwa aplikasi tersebut benar-benar dibuat oleh tim kalian dan bukan oleh pihak lain yang berniat jahat. Tanpa stempel ini, sistem Android akan menolak instalasi aplikasi demi keamanan.
OpenCode: Anggap OpenCode sebagai asisten teknis pribadi berbasis kecerdasan buatan (AI) yang bekerja di samping kalian. Kalian tidak perlu menghafal perintah-perintah pemrograman yang rumit; cukup berikan instruksi langsung dalam bahasa Indonesia sehari-hari, dan OpenCode akan mengeksekusi perintah-perintah teknis di balik layar hingga aplikasi kalian berhasil dicetak.
Bagian 1: Panduan Step-by-Step Build APK dengan OpenCode

Untuk mulai mencetak aplikasi, buka terminal pada Antigravity atau VS Code kalian, masuk ke folder proyek React Native, lalu ketik perintah opencode. Setelah asisten AI aktif, salin dan tempel perintah-perintah (prompt) di bawah ini secara berurutan.

Penting: Pastikan kalian mengganti semua teks di dalam kurung siku [...] sesuai dengan data kelompok dan proyek kalian sendiri sebelum mengirimkan perintah!

Langkah 1: Mengatur Identitas & Versi Aplikasi

Tempelkan prompt berikut untuk mengonfigurasi identitas aplikasi kalian:

text
Tolong atur identitas aplikasi ini supaya siap dirilis.
Ubah nama aplikasi menjadi [Nama Aplikasi Kalian], atur ID
uniknya menjadi com.[namakelompok].[namaaplikasi] (huruf
kecil semua tanpa spasi), dan pastikan versinya adalah
1.0.0 (versionCode 1). Tolong perbaiki semua file
pengaturan yang terkait.
Langkah 2: Membuat Stempel Resmi (Release Keystore)

Jalankan prompt ini untuk membuat file pengaman aplikasi:

text
Saya butuh membuat kunci pengaman resmi (release keystore)
agar aplikasi ini bisa diinstal di HP orang lain. Tolong
buatkan file release-key.keystore di dalam folder
android/app/ menggunakan password [buatpassword123] dan
alias [namakelompok]. Pastikan file ini tidak ikut
terunggah ke GitHub demi keamanan.

Catatan Keamanan: Catat dan simpan password serta alias yang kalian buat di tempat yang aman. Jika kalian kehilangan data ini, aplikasi yang sudah dirilis tidak akan bisa diperbarui lagi di masa mendatang.

Langkah 3: Menghubungkan Keystore ke Sistem Build

Gunakan prompt ini untuk menyambungkan kunci pengaman ke konfigurasi build Android:

text
Tolong hubungkan file release-key.keystore yang baru saja
dibuat tadi ke pengaturan build release Android
(gradle.properties dan build.gradle), menggunakan password
[buatpassword123] dan alias [namakelompok]. Pastikan
semuanya terpasang dengan benar.
Langkah 4: Mencetak File APK (Build Release)

Perintahkan OpenCode untuk memulai proses kompilasi aplikasi:

text
Semua sudah siap. Tolong cetak file aplikasi (build release
APK) sekarang. Jika di tengah jalan muncul pesan error atau
masalah teknis, tolong langsung analisis dan perbaiki
otomatis sampai file app-release.apk berhasil dibuat.
Langkah 5: Mengambil File APK & Kode Keamanan SHA-256

Dapatkan lokasi file output dan nilai pengaman SHA-256:

text
Tunjukkan lokasi persis file app-release.apk yang baru jadi
supaya saya mudah mencarinya di File Explorer atau Finder.
Selain itu, tolong tampilkan kode SHA-256 checksum dan
ukuran file APK-nya dalam MB untuk syarat upload ke
horizonLab.click
Cek Mandiri (Self-Check)

Sebelum mengunggah file ke platform publik, kirimkan file app-release.apk tersebut ke smartphone Android milik anggota kelompok melalui WhatsApp atau Google Drive. Pasang aplikasi tersebut dan jalankan seluruh fiturnya. Pastikan aplikasi dapat berjalan lancar tanpa tergantung pada koneksi kabel laptop atau server pengembangan lokal.

Bagian 2: Panduan Publikasi di horizonlab.click & Persiapan Aset Store
2.1 Pendaftaran Akun Kelompok di HorizonLab.click
Akses Portal: Buka browser di laptop, kunjungi https://horizonlab.click, lalu klik tombol Sign Up di pojok kanan atas.
Gunakan Email Terpusat: Daftarkan menggunakan email resmi ketua kelompok atau buat email khusus tim (contoh: tim3.aplikasiku@gmail.com). Hindari email yang jarang dibuka karena kode verifikasi dan pemberitahuan status rilis akan dikirim ke sini.
Isi Identitas Pengembang (Developer Profile):
Username: Isi dengan nama tim atau nama studio kelompok kalian (contoh: Nusantara-Digital-Studio atau Kelompok-4). Nama ini akan tampil di bawah judul aplikasi kalian.
Password: Buat kata sandi minimal 8 karakter (kombinasi huruf dan angka), lalu catat di grup internal kelompok agar semua anggota bisa mengaksesnya jika diperlukan.
Aktivasi Akun: Buka kotak masuk (Inbox) atau folder Spam pada email yang didaftarkan, temukan email dari HorizonLab, dan klik tombol Verify Email Address. Setelah berhasil, lakukan Login ke dalam Developer Dashboard.
Aktivasi Email: Buka kotak masuk (Inbox) atau folder Spam pada email yang didaftarkan, temukan email dari HorizonLab, dan klik tombol Verify Email Address.
2.2 Menyiapkan Paket Aset Store (Untuk HorizonLab.click & Siap Play Store)

Sebelum mengunggah aplikasi ke HorizonLab.click, siapkan seluruh aset etalase pemasaran berikut agar langsung siap digunakan baik di platform HorizonLab maupun Google Play Store nanti:

1. High-Res App Icon (Ukuran: 512 x 512 piksel)
Alat: Gunakan Canva (pilih Custom Size → 512 x 512 px), unduh dalam format PNG.
Aturan Desain: Fokus pada 1 simbol atau logo utama yang besar di tengah dengan latar belakang warna solid atau gradasi lembut. Jangan menaruh kalimat panjang atau tulisan kecil di dalam ikon karena akan buram di layar HP. Biarkan bentuk gambar tetap kotak persegi penuh karena sistem Android otomatis memotong ujungnya menjadi melengkung.
2. Feature Graphic / Banner Promosi (Ukuran: 1024 x 500 piksel)
Alat: Canva (Custom Size → 1024 x 500 px), unduh format JPG atau PNG (tanpa latar transparan).
Komposisi Visual: Letakkan ikon aplikasi di sisi kiri, nama aplikasi dengan huruf tebal di tengah/kanan, ditambah 1 kalimat slogan manfaat (maksimal 5–7 kata). Contoh: "Atur Keuangan Kos Harian Tanpa Ribet".
3. Minimal 4 Screenshot Layar Aplikasi (Rasio 9:16 Potret HP)
Cara Membuat: Jalankan aplikasi di HP kalian, ambil tangkapan layar (screenshot) pada 4 halaman paling penting (misal: Halaman Utama/Dashboard, Halaman Input Data, Halaman Laporan/Hasil, dan Halaman Fitur Unggulan).
Tips: Masukkan 4 screenshot mentah tersebut ke dalam template Phone Mockup di Canva (ukuran 1080 x 1920 px), lalu beri judul singkat di bagian atas tiap gambar untuk memandu mata calon pengguna. Contoh urutan 4 gambar:
Gambar 1: "Pantau Pengeluaran Harian dalam Satu Layar"
Gambar 2: "Catat Transaksi Cuma Butuh 3 Detik"
Gambar 3: "Grafik Otomatis Keuangan Mingguanmu"
Gambar 4: "Pengingat Tagihan Biar Nggak Telat Bayar"
4. Copywriting Deskripsi Aplikasi (Contoh Praktis)

Short Description (maksimal 80 karakter, wajib ringkas & menjual):

❌ Contoh Kurang Tepat (terlalu teknis): "Aplikasi mobile berbasis React Native untuk mencatat pemasukan dan pengeluaran."
✅ Contoh Tepat (berorientasi manfaat): "Catat pengeluaran harian dalam 3 detik & atur budget anak kos lebih hemat!" (76 karakter)

Full Description (struktur 3 bagian):

Paragraf Pembuka (Masalah & Solusi): Jelaskan masalah yang sering dialami target pengguna dan bagaimana aplikasi ini menyelesaikannya.
Poin Fitur Utama: Sebutkan 3–5 fitur unggulan beserta manfaatnya bagi pengguna.
Ajakan Unduh (Call to Action): Kalimat penutup singkat yang mengajak pengguna mencoba sekarang.
5. Pembuatan Tautan Privacy Policy (Cara Tercepat Tanpa Coding)
Salin template Privacy Policy di Bagian 3 ke dalam sebuah Google Docs baru.
Klik tombol Share (Bagikan) di pojok kanan atas Google Docs → ubah General Access menjadi Anyone with the link (Siapa saja yang memiliki link) dengan peran Viewer (Pelihat).
Klik Copy Link. Tautan inilah yang ditempelkan di HorizonLab.click maupun Google Play Console nanti.
2.3 Mengunggah Proyek Pertama & Verifikasi Publik di HorizonLab.click

Setelah seluruh aset etalase siap, ikuti alur penerbitan aplikasi berikut:

Mulai Unggah: Masuk ke horizonlab.click lalu klik tombol Kirim Aplikasi.
Isi Metadata Aplikasi & Informasi AI Tools: Isi kolom Nama aplikasi dan Package name (harus unik, misalnya com.contoh.aplikasi). Pilih kategori yang sesuai (Keuangan, Edukasi, Produktivitas, Gaya Hidup, dll.), lalu isi AI Tools & Framework yang digunakan (misal: Cursor, Expo). Setelah itu, tempelkan Deskripsi singkat (maksimal 80 karakter) dan Deskripsi lengkap (mendukung format Markdown).
Unggah File APK & Detail Versi: Isi Nama versi (misal: 1.0.0), Version code (angka bulat, misal: 1), dan pilih Minimal Android yang didukung. Anda juga bisa mengisi catatan pembaruan di kolom Apa yang baru. Pilih sumber file "Upload APK" lalu unggah file app-release.apk (maksimal 50 MB).

Catatan: Anda tidak perlu menempelkan kode SHA-256 karena hash dan ukuran file akan dihitung otomatis oleh server.

Lampirkan Tautan & Aset Visual: Masukkan tautan publik (harus diawali https://) untuk Website, Kode sumber (GitHub/GitLab), dan Kebijakan privasi. Selanjutnya, unggah:
Ikon (rasio 1:1, maksimal 2 MB)
Banner opsional (pengganti Feature Graphic, lebar maksimal 1600 px)
Screenshot (minimal 2 gambar, maksimal 8 gambar, batas 3 MB per file)
Kirim untuk Peninjauan (Review): Centang kotak pernyataan bahwa Anda adalah pemilik aplikasi, bebas malware, dan tidak melanggar hak cipta. Klik tombol Kirim untuk ditinjau.

Catatan: Aplikasi tidak akan langsung Live. Aplikasi akan ditinjau oleh admin terlebih dahulu sebelum tayang. Anda akan menerima kabar lewat email dan notifikasi saat aplikasi sudah diterbitkan dan siap diuji coba unduh.

Bagian 3: Template Siap Pakai (Privacy Policy & Kuesioner Validasi Pengguna)
3.1 Template Kebijakan Privasi (Privacy Policy)

Instruksi: Salin seluruh teks di dalam kotak di bawah ini ke sebuah dokumen Google Docs baru milik kelompok kalian. Ganti semua teks di dalam tanda kurung siku [...] sesuai kondisi aplikasi kalian (hapus poin yang tidak relevan dengan fitur aplikasi kalian), lalu atur akses dokumen menjadi Publik (Anyone with the link - Viewer).

text
KEBIJAKAN PRIVASI (PRIVACY POLICY)

Aplikasi: [Nama Aplikasi Kalian]
Tanggal Berlaku: [Tanggal Rilis, misal: 16 November 2026]

Kebijakan Privasi ini menjelaskan bagaimana [Nama Tim / Kelompok Kalian]
("Kami") mengumpulkan, menggunakan, menyimpan, dan melindungi informasi
pribadi pengguna saat Anda menggunakan aplikasi mobile [Nama Aplikasi
Kalian] ("Aplikasi") yang didistribusikan melalui HorizonLab.click maupun
Google Play Store. Dengan mengunduh dan menggunakan Aplikasi ini, Anda
menyetujui praktik pengelolaan data yang dijelaskan dalam kebijakan ini.

1. Informasi yang Kami Kumpulkan
Kami hanya mengumpulkan data yang relevan dan dibutuhkan secara langsung
agar fitur utama Aplikasi dapat berfungsi dengan baik:
a. Data yang Anda Berikan Secara Langsung: Informasi yang Anda masukkan
   saat mendaftar atau menggunakan fitur aplikasi, seperti nama panggilan,
   alamat email, nomor telepon, atau catatan/konten yang Anda simpan di
   dalam Aplikasi.
b. Data Teknis & Perangkat (Otomatis): Informasi non-pribadi terkait
   perangkat Anda (seperti jenis perangkat, versi sistem operasi Android,
   dan laporan kerusakan/crash log) yang digunakan semata-mata untuk
   memastikan Aplikasi berjalan stabil.
c. Izin Perangkat (Permissions): Aplikasi ini hanya meminta akses perangkat
   yang benar-benar diperlukan untuk fitur inti, seperti [pilih yang sesuai
   dengan aplikasi kalian, hapus sisanya: akses Internet / Kamera untuk
   memindai atau mengambil foto / Penyimpanan lokal untuk menyimpan berkas].

2. Tujuan Penggunaan Informasi
Seluruh data yang dikumpulkan digunakan secara terbatas untuk:
a. Menyediakan, mengoperasikan, dan memelihara fungsionalitas utama
   Aplikasi.
b. Menyimpan preferensi serta riwayat aktivitas Anda di dalam Aplikasi agar
   mudah diakses kembali.
c. Menganalisis kendala teknis, memperbaiki bug, dan meningkatkan
   pengalaman pengguna (user experience).
d. Mengirimkan pemberitahuan penting terkait pembaruan layanan atau
   dukungan teknis jika Anda menghubungi kami.

3. Penyimpanan, Keamanan, dan Pembagian Data
a. Keamanan Data: Data Anda disimpan menggunakan [pilih yang sesuai:
   penyimpanan lokal di perangkat Anda / layanan cloud terenkripsi seperti
   Firebase atau Supabase] dengan langkah perlindungan teknis yang wajar
   untuk mencegah akses, perubahan, atau pengungkapan yang tidak sah.
b. Larangan Penjualan Data: Kami tidak pernah menjual, menyewakan, atau
   memperdagangkan data pribadi Anda kepada pihak ketiga mana pun untuk
   tujuan pemasaran maupun periklanan.
c. Layanan Pihak Ketiga: Aplikasi ini dapat menggunakan layanan pihak
   ketiga tepercaya untuk mendukung infrastruktur teknis (seperti Google
   Play Services atau layanan analitik dasar), yang masing-masing tunduk
   pada kebijakan privasi mereka sendiri.

4. Privasi Anak di Bawah Umur
Aplikasi ini ditujukan untuk pengguna umum dan tidak secara khusus
menargetkan anak-anak di bawah usia 13 tahun. Kami tidak dengan sengaja
mengumpulkan data pribadi dari anak di bawah umur tanpa persetujuan orang
tua atau wali.

5. Hak Pengguna & Penghapusan Data
Sesuai dengan prinsip pelindungan data pribadi, Anda memiliki hak penuh
untuk:
a. Mengakses, memperbarui, atau mengoreksi informasi pribadi Anda langsung
   melalui pengaturan di dalam Aplikasi.
b. Meminta penghapusan akun beserta seluruh data pribadi yang tersimpan di
   sistem kami kapan saja. Permintaan penghapusan data akan kami proses
   maksimal dalam waktu 7 x 24 jam setelah permohonan diterima melalui
   email kontak di bawah ini.

6. Perubahan Kebijakan Privasi
Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu seiring
pengembangan fitur Aplikasi. Setiap perubahan akan diumumkan melalui
pembaruan tanggal berlaku di halaman ini.

7. Hubungi Kami (Kontak Pengembang)
Apabila Anda memiliki pertanyaan, keluhan, atau permintaan terkait privasi
dan penghapusan data, silakan hubungi tim pengembang kami melalui:
Nama Tim / Pengembang: [Nama Tim / Studio Kelompok Kalian]
Email Resmi: [emailkelompok@gmail.com]

Catatan singkat sebelum membagikan link:

Sesuaikan Izin Perangkat (Poin 1): Jika aplikasi hanya berupa kalkulator, catatan lokal, atau katalog informasi tanpa akses kamera/lokasi, hapus bagian kamera/penyimpanan dan cukup tulis "akses Internet dasar". Google Play Store sangat ketat memeriksa kesesuaian antara izin yang tertulis di Privacy Policy dengan izin yang diminta di dalam kode APK.
Uji Tautan: Pastikan tautan Google Docs dibuka menggunakan mode Incognito / Penyamaran di browser untuk memastikan dosen dan calon pengguna bisa membacanya tanpa perlu meminta izin akses (Request Access).
3.2 Template Kuesioner Beta Testing (Untuk Google Form) — Opsional

Salin kerangka kuesioner di bawah ini ke Google Form kelompok kalian, lalu bagikan tautannya bersamaan dengan link aplikasi kepada minimal 5–10 orang penguji di luar tim (mahasiswa kelas lain, teman kos, atau calon pengguna target). Hasil grafik dan kutipan jawaban dari form ini adalah bukti validasi pasar (Traction) saat sesi pitching.

Judul Google Form: Uji Coba & Masukan Pengguna Aplikasi [Nama Aplikasi Kalian] (Versi Beta)

Deskripsi Form: Halo! Terima kasih sudah meluangkan waktu 2 menit untuk mencoba aplikasi [Nama Aplikasi Kalian]. Unduh aplikasi kami melalui tautan horizonLab.click berikut: [Tempel Link HorizonLab.click Kalian], coba fitur utamanya, lalu isi penilaian jujur Anda di bawah ini untuk membantu kami menyempurnakan kualitas produk dan pengalaman penggunaan aplikasi ini sebelum rilis di Google Play Store.

1. Profil Penguji (Jawaban Singkat / Short Answer)
Pertanyaan: Nama / Inisial dan Profesi atau Status Anda saat ini (contoh: Rina — Mahasiswa / Andi — Pemilik Kedai Kopi).
Tujuan Data: Memastikan penguji sesuai dengan segmen target pengguna (persona) yang dibidik.
2. Manfaat & Relevansi Solusi Aplikasi terhadap Masalah Pengguna (Skala Linear 1–5)
Pertanyaan: Seberapa besar aplikasi ini membantu menyelesaikan masalah [sebutkan masalah utama yang disasar] yang Anda alami sehari-hari? (1 = Tidak Membantu Sama Sekali, 5 = Sangat Membantu)
Tujuan Data: Mengukur relevansi dan validasi solusi produk terhadap kebutuhan nyata calon pengguna.
3. Kejelasan Tampilan & Kemudahan Penggunaan / UX (Skala Linear 1–5)
Pertanyaan: Tanpa panduan dari tim kami, seberapa mudah Anda memahami cara kerja aplikasi ini saat pertama kali dibuka? (1 = Sangat Membingungkan, 5 = Sangat Jelas & Intuitif)
Tujuan Data: Menghitung skor rata-rata kemudahan penggunaan (UX Score) untuk ditampilkan di slide presentasi.
4. Keberhasilan Menjalankan Fitur Utama / Core Task (Pilihan Ganda / Multiple Choice)
Pertanyaan: Apakah Anda berhasil menyelesaikan tugas utama di dalam aplikasi (misal: [sebutkan tugas inti aplikasi kalian, contoh: mencatat transaksi dan melihat laporan]) hingga selesai?
Opsi Jawaban:
Ya, berhasil lancar 100% tanpa kendala
Berhasil, tetapi sempat bingung mencari tombol/menu tertentu
Gagal karena aplikasi error / berhenti sendiri (force close)
Tujuan Data: Mengukur tingkat keberhasilan fungsi inti MVP (Task Completion Rate).
5. Masukan Perbaikan & Temuan Kendala / Bug (Paragraf / Paragraph)
Pertanyaan: Bagian mana yang menurut Anda masih membingungkan, kurang menarik tampilannya, atau mengalami error saat dicoba?
Tujuan Data: Menjadi dasar perbaikan nyata dari versi 1.0.0 ke versi 1.0.1.
6. Validasi Kecocokan Pasar / Product-Market Fit (Pilihan Ganda / Multiple Choice)
Pertanyaan: Jika aplikasi ini sudah tersedia resmi di Google Play Store, seberapa besar kemungkinan Anda akan menggunakannya secara rutin atau merekomendasikannya ke teman?
Opsi Jawaban:
Pasti akan saya pakai dan rekomendasikan
Mungkin akan saya pakai jika fitur tertentu sudah ditambahkan
Belum tertarik menggunakannya
Tujuan Data: Membuktikan adanya minat beli/pakai nyata dari calon pengguna kepada "calon investor" di kelas.
7. Alasan Utama & Saran Fitur (Jawaban Singkat / Short Answer)
Pertanyaan: Apa satu hal yang paling Anda sukai dari aplikasi ini, atau fitur apa yang paling Anda harapkan ada di versi berikutnya?
Tujuan Data: Bahan kutipan testimoni pengguna nyata (user quote) di slide presentasi.
Bagian 4: Panduan Menyusun Pitch Deck Profesional (Simulasi Investor & User Pitch)
4.1 Filosofi & Tujuan Pitching

Sesi presentasi di kelas ini dirancang sebagai simulasi Startup Demo Day, bukan presentasi makalah kuliah biasa. Mahasiswa berperan sebagai Founders (pendiri produk), sementara dosen dan teman sekelas berperan ganda sebagai Calon Investor (yang menilai kelayakan masalah, validasi kebutuhan pengguna, kualitas produk, dan model bisnis) serta Calon Pengguna (yang menguji pengalamannya secara langsung).

Perlu ditegaskan bahwa HorizonLab.click hanyalah sarana distribusi cepat agar audiens bisa langsung mencoba aplikasi di ponsel masing-masing, sedangkan fokus utama penilaian dan diskusi adalah kualitas produk aplikasi, pengalaman pengguna (UX), penyelesaian masalah, dan potensi bisnisnya.

Agar meyakinkan layaknya pitching profesional di dunia nyata, pegang tiga prinsip utama berikut:

Clarity (Kejelasan): Audiens harus paham apa fungsi aplikasi kalian dan siapa penggunanya dalam 10 detik pertama tanpa istilah teknis pemrograman.
Evidence (Berbasis Bukti): Bicara menggunakan angka dan umpan balik nyata dari hasil testing menggunakan horizonlab.click, bukan sekadar asumsi kelompok.
Traction (Bukti Eksekusi): Tunjukkan bahwa tim kalian tidak hanya punya ide di atas kertas, tetapi sudah merilis aplikasi nyata, mengujinya ke pengguna luar, dan memperbaikinya.
4.2 Alur Utama Sesi Pitching
Hook & Live Download: Menampilkan Slide 1 dengan QR Code besar menuju halaman HorizonLab.click. Presenter membuka dengan kalimat pembuka (hook) yang memikat sementara dosen dan audiens memindai QR Code serta mengunduh APK di ponsel masing-masing.
Pitching & Live Product Demo: Penyampaian inti materi secara padat, dinamis, dan meyakinkan, termasuk demonstrasi langsung aplikasi (maksimal 120 detik).
Sesi Tanya Jawab Kritis (Investor & User Q&A): Sesi uji ketahanan ide dari dua sudut pandang:
Sudut Pandang Investor: ukuran pasar, validasi masalah, pengalaman pengguna, model monetisasi, keunggulan dibanding kompetitor.
Sudut Pandang Pengguna: ulasan langsung mengenai kualitas fitur, kenyamanan antarmuka, dan kemudahan penggunaan aplikasi setelah memakai APK.
Penutupan & Transisi: Kesimpulan singkat (closing statement), pengisian penilaian dari audience.
4.3 Blueprint 8 Poin Pitch Deck (Struktur & Elemen Wajib)

Gunakan kerangka 8 poin di bawah ini sebagai dasar penyusunan presentasi kalian. Setiap poin dilengkapi tujuan bisnis dan elemen penting yang sebaiknya ada:

Poin 1: Sampul Produk & Live Download QR Code
Tujuan: Menciptakan kesan pertama profesional dan memicu audiens langsung mengunduh aplikasi.
Elemen Penting: Logo aplikasi (512x512 px), Nama Produk, Tagline 1 kalimat singkat, nama & peran anggota tim (misal: Product Lead, Marketing & Growth, UX & Content), serta QR Code berukuran besar mengarah ke link HorizonLab.click aplikasi kalian.
Poin 2: Masalah Nyata & Urgensi (The Problem)
Tujuan: Membuat audiens merasakan keresahan nyata yang dialami calon pengguna.
Elemen Penting: Profil spesifik target pengguna (persona), 2–3 poin masalah utama (pain points) dengan bahasa sehari-hari, dan dampak kerugian jika masalah tidak diselesaikan (waktu terbuang, uang boros, atau proses rumit).
Poin 3: Solusi & Proposisi Nilai Unik (The Solution & UVP)
Tujuan: Memperkenalkan aplikasi sebagai jawaban paling sederhana dan efektif atas masalah di Slide 2.
Elemen Penting: Satu kalimat proposisi nilai utama (Unique Value Proposition), 3 fitur inti aplikasi beserta manfaat langsungnya dalam menyelesaikan masalah pengguna, dan perbandingan singkat cara lama vs pengalaman mudah memakai fitur aplikasi kalian.
Poin 4: Demonstrasi Produk Langsung (Live Demo)
Tujuan: Membuktikan bahwa fitur aplikasi benar-benar berfungsi, memiliki antarmuka yang intuitif, dan siap memberikan pengalaman penggunaan (UX) yang baik bagi pengguna.
Elemen Penting: Video rekaman layar (screen recording) berdurasi maksimal 120 detik yang disematkan langsung di dalam slide, menunjukkan satu alur utuh penggunaan aplikasi (buka aplikasi, jalankan fitur utama, dan tampilkan hasil akhir).
Poin 5: Target Pasar & Strategi Akuisisi Pengguna (Market & Go-To-Market)
Tujuan: Menunjukkan siapa pembeli atau pengguna pertama dan bagaimana cara mendapatkan 100 pengguna pertama secara nyata.
Elemen Penting: Segmen pengguna awal (Early Adopters yang spesifik), perkiraan jumlah calon pengguna di lingkungan kampus atau komunitas, dan 2–3 saluran distribusi nyata (misal: komunitas mahasiswa, konten TikTok/Instagram edukasi, atau kerja sama mitra lokal).
Poin 6: Model Bisnis & Potensi Pendapatan (Business Model)
Tujuan: Menjawab pertanyaan utama investor: "Bagaimana aplikasi ini bisa menghasilkan uang atau nilai ekonomi berkelanjutan?"
Elemen Penting: Skema aliran pendapatan (revenue stream) yang masuk akal untuk tahap awal (misal: Freemium fitur dasar gratis dan fitur laporan lanjutan berbayar, komisi transaksi mitra, atau paket promosi UMKM lokal).
Poin 7: Bukti Validasi Pasar & Iterasi Produk (Traction & Iteration)
Tujuan: Membuktikan bahwa tim mendengar masukan pengguna nyata terkait fitur dan pengalaman penggunaan aplikasi, serta mampu melakukan iterasi perbaikan produk secara efektif.
Elemen Penting: Tangkapan layar rekap Google Form dari minimal 5–10 penguji luar, skor rata-rata kemudahan penggunaan (skala 1–5), dan studi kasus Before–After perbaikan versi (v1.0.0 ke v1.0.1) berdasarkan masukan penguji.
Poin 8: Kesiapan Play Store, Roadmap & Penutup (Next Steps & Ask)
Tujuan: Menunjukkan kesiapan melangkah ke Google Play Store dan menutup presentasi dengan kuat.
Elemen Penting: Status kelengkapan 100% aset Pra-Play Store (ikon, banner, 4 screenshot, privacy policy), rencana pengembangan 3 bulan ke depan (roadmap), dan kalimat penutup (closing call-to-action).
Checklist Kesiapan Akhir
[ ] Trello Link
[ ] Halaman APK sudah di-upload di horizonlab.click
[ ] Pitching Deck (PPT)

Semua item akan dikumpulkan melalui link Google Forms sebelum FINAL.

Note: Final akan diadakan pada pertemuan 15 dan 16.