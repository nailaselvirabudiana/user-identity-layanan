# 🚀 CARA DEPLOY SUPER MUDAH - UNTUK PEMULA

## ✨ Apa yang Akan Kita Lakukan?

Kita akan deploy aplikasi ini ke server **tanpa ribet**. Prosesnya:
1. Kamu build di komputer Windows → Upload ke internet (Docker Hub)
2. Server download dari internet → Langsung jalan!

**TIDAK PERLU** install Node.js, npm, atau apapun di server! ✅

---

## 📋 PERSIAPAN (Sekali Aja!)

### 1. Buat Akun Docker Hub (GRATIS)

1. Buka: https://hub.docker.com
2. Klik **Sign Up**
3. Isi:
   - Email: email kamu
   - Username: **catat username ini** (contoh: `johndoe`)
   - Password: password kamu
4. Verifikasi email
5. Selesai! ✅

### 2. Install Docker Desktop di Windows

1. Download: https://www.docker.com/products/docker-desktop
2. Install seperti biasa (Next → Next → Finish)
3. Restart komputer
4. Buka Docker Desktop (tunggu sampai ada tulisan "Docker Desktop is running")
5. Selesai! ✅

---

## 🎯 STEP 1: SETUP DI KOMPUTER KAMU (Windows)

### A. Edit File Setup

1. **Buka folder** `c:\user-identity-layanan`

2. **Klik kanan** file `build-and-push.ps1` → Edit with Notepad

3. **Ganti baris ini**:
   ```powershell
   $DOCKER_USER = "noivira124"
   ```
   Jadi (ganti dengan username Docker Hub kamu):
   ```powershell
   $DOCKER_USER = "noivira124"
   ```
   **SIMPAN** (Ctrl+S)

4. **Klik kanan** file `docker-compose.production.yml` → Edit with Notepad

5. **Ganti 2 baris ini**:
   ```yaml
   image: noivira124/user-identity-backend:latest
   ```
   Jadi:
   ```yaml
   image: noivira124/user-identity-backend:latest
   ```
   
   Dan:
   ```yaml
   image: yourusername/user-identity-frontend:latest
   ```
   Jadi:
   ```yaml
   image: noivira124/user-identity-frontend:latest
   ```
   **SIMPAN** (Ctrl+S)

### B. Build & Upload ke Internet

1. **Buka PowerShell**:
   - Tekan tombol `Windows + X`
   - Klik **Windows PowerShell** atau **Terminal**

2. **Masuk ke folder project**:
   ```powershell
   cd c:\user-identity-layanan
   ```

3. **Jalankan script**:
   ```powershell
   .\build-and-push.ps1
   ```

4. **Login Docker Hub** (diminta sekali):
   - Username: (username Docker Hub kamu)
   - Password: (password Docker Hub kamu)

5. **Tunggu proses** (~5-10 menit):
   - Komputer akan build aplikasi
   - Upload ke Docker Hub otomatis
   - Kalau ada tulisan "SUCCESS" → Berhasil! ✅

---

## 🌐 STEP 2: DEPLOY KE SERVER AAPANEL

### A. Upload File ke Server

1. **Login aaPanel**: https://panel.queenifyofficial.site

2. **Klik menu** "Files" (File Manager)

3. **Masuk folder** `/www/wwwroot/`

4. **Buat folder baru**:
   - Klik **Create** → **Folder**
   - Nama: `user-identity-layanan`
   - Klik OK

5. **Masuk folder** `user-identity-layanan`

6. **Upload 2 file**:
   - Klik **Upload**
   - Pilih file `docker-compose.production.yml` dari komputer kamu
   - Pilih file `deploy-server.sh` dari komputer kamu
   - Tunggu sampai upload selesai

7. **Rename file**:
   - Klik kanan `docker-compose.production.yml`
   - Rename jadi: `docker-compose.yml`

8. **Buat folder data**:
   - Klik **Create** → **Folder**
   - Nama: `data`
   - Klik OK

### B. Jalankan Aplikasi di Server

1. **Buka Terminal** di aaPanel:
   - Klik menu **Terminal** (atau **SSH**)

2. **Masuk ke folder**:
   ```bash
   cd /www/wwwroot/user-identity-layanan
   ```

3. **Buat script bisa dijalankan**:
   ```bash
   chmod +x deploy-server.sh
   ```

4. **Jalankan deploy**:
   ```bash
   ./deploy-server.sh
   ```

5. **Login Docker Hub** (diminta sekali):
   - Username: (username Docker Hub kamu)
   - Password: (password Docker Hub kamu)

6. **Tunggu proses** (~2-5 menit):
   - Server download aplikasi dari Docker Hub
   - Start aplikasi otomatis
   - Kalau ada tulisan container "Running" → Berhasil! ✅

7. **Tekan** `Ctrl + C` untuk keluar dari logs

8. **Cek aplikasi jalan**:
   ```bash
   docker ps
   ```
   Harus ada 2 container: `user-identity-backend` dan `user-identity-frontend` ✅

---

## 🔗 STEP 3: SETUP DOMAIN & SSL

### A. Setup Backend API (api.queenifyofficial.site)

1. **Di aaPanel**, klik menu **Website**

2. **Klik** "Add site"

3. **Isi form**:
   - Domain Name: `api.queenifyofficial.site`
   - PHP Version: **Pure static** (atau disable PHP)
   - Create database: **NO**
   - Klik **Submit**

4. **Edit Config**:
   - Klik nama domain `api.queenifyofficial.site`
   - Tab **Config**
   - **Hapus semua isi**, ganti dengan:

```nginx
server {
    listen 80;
    server_name api.queenifyofficial.site;

    location / {
        proxy_pass http://127.0.0.1:3040;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

5. **Save** (klik Save di bawah)

6. **Enable SSL**:
   - Tab **SSL**
   - Klik **Let's Encrypt**
   - Klik **Apply**
   - Tunggu ~1 menit
   - Status jadi "Applied" → Berhasil! ✅

### B. Setup Frontend (app.queenifyofficial.site)

1. **Add site** lagi:
   - Domain: `app.queenifyofficial.site`
   - PHP: **Pure static**
   - Database: **NO**

2. **Edit Config**, ganti dengan:

```nginx
server {
    listen 80;
    server_name app.queenifyofficial.site;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Save**

4. **Enable SSL** (sama seperti backend)

---

## ✅ TEST APLIKASI

### 1. Test Backend

Buka browser, ketik:
```
https://api.queenifyofficial.site/health
```

Harus keluar:
```json
{"status":"ok"}
```
✅ **Backend jalan!**

### 2. Test Frontend

Buka browser:
```
https://app.queenifyofficial.site
```

Harus muncul halaman login aplikasi! ✅

### 3. Test Login

1. Di halaman login, isi:
   - Email: `admin@mail.com`
   - Password: `admin123`
2. Klik Login
3. Kalau berhasil masuk dashboard → **SUKSES!** 🎉

---

## 🔄 CARA UPDATE APLIKASI (Kalau Ada Perubahan Code)

### Di Komputer Windows:

1. Edit code seperti biasa
2. Simpan
3. Buka PowerShell:
   ```powershell
   cd c:\user-identity-layanan
   .\build-and-push.ps1
   ```
4. Tunggu sampai selesai

### Di Server aaPanel:

1. Buka Terminal
2. Jalankan:
   ```bash
   cd /www/wwwroot/user-identity-layanan
   ./deploy-server.sh
   ```
3. Selesai! Aplikasi update otomatis ✅

---

## 🆘 TROUBLESHOOTING (Kalau Ada Masalah)

### ❌ "Cannot connect to Docker daemon" (Windows)

**Solusi**: 
- Buka **Docker Desktop**
- Tunggu sampai ada tulisan "Docker Desktop is running"
- Coba lagi

### ❌ "Login failed" saat build-and-push.ps1

**Solusi**:
- Pastikan username & password Docker Hub benar
- Cek email, pastikan sudah verified
- Login manual: `docker login`

### ❌ Container tidak jalan di server

**Cek logs**:
```bash
cd /www/wwwroot/user-identity-layanan
docker-compose logs
```

**Restart**:
```bash
docker-compose restart
```

**Stop & start ulang**:
```bash
docker-compose down
docker-compose up -d
```

### ❌ "Port already in use"

**Cek port**:
```bash
netstat -tlnp | grep 3040
netstat -tlnp | grep 8080
```

**Kill process**:
```bash
# Ganti <PID> dengan angka yang muncul
kill -9 <PID>
```

### ❌ "502 Bad Gateway" saat buka domain

**Solusi**:
1. Cek container jalan:
   ```bash
   docker ps
   ```
2. Kalau tidak ada, start lagi:
   ```bash
   cd /www/wwwroot/user-identity-layanan
   docker-compose up -d
   ```

### ❌ CORS Error di browser

**Solusi**:
- Pastikan domain frontend sudah ada di CORS backend
- Sudah otomatis di code: `https://app.queenifyofficial.site`

---

## 📝 RANGKUMAN PERINTAH PENTING

### Di Server (via Terminal aaPanel):

```bash
# Masuk folder
cd /www/wwwroot/user-identity-layanan

# Lihat status container
docker ps

# Lihat logs
docker-compose logs -f

# Restart aplikasi
docker-compose restart

# Stop aplikasi
docker-compose down

# Start aplikasi
docker-compose up -d

# Update aplikasi (download versi baru)
./deploy-server.sh
```

### Di Windows (PowerShell):

```powershell
# Masuk folder
cd c:\user-identity-layanan

# Build & upload ke internet
.\build-and-push.ps1

# Login Docker Hub
docker login
```

---

## 🎓 PENJELASAN SEDERHANA

### Apa itu Docker?
- **Seperti kardus** yang isinya aplikasi lengkap siap pakai
- Tinggal buka kardus → Langsung jalan
- Tidak perlu install Node.js, database, dll

### Apa itu Docker Hub?
- **Seperti Google Drive** untuk Docker
- Upload sekali, download berkali-kali
- Server tinggal download, langsung jalan

### Kenapa pakai Docker?
- ✅ **Mudah**: Tidak perlu setup ribet di server
- ✅ **Cepat**: Upload sekali, deploy ke banyak server
- ✅ **Aman**: Aplikasi terisolasi, tidak bentrok
- ✅ **Update gampang**: Tinggal jalankan 1 script

---

## 📞 BUTUH BANTUAN?

Kalau ada error, screenshot error-nya lalu:
1. Cek bagian Troubleshooting di atas
2. Cek logs: `docker-compose logs`
3. Restart: `docker-compose restart`

**SELAMAT! Aplikasi kamu sudah live di internet!** 🎉
