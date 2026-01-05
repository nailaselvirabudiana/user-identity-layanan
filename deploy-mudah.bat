@echo off
chcp 65001 >nul
cls

echo ═══════════════════════════════════════════════════
echo    🚀 DEPLOY APLIKASI USER IDENTITY - SUPER MUDAH
echo ═══════════════════════════════════════════════════
echo.

REM Cek Docker Desktop
echo [STEP 1] Mengecek Docker Desktop...
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ GAGAL: Docker Desktop tidak jalan!
    echo.
    echo 💡 SOLUSI:
    echo    1. Buka aplikasi Docker Desktop
    echo    2. Tunggu sampai muncul "Docker Desktop is running"
    echo    3. Jalankan script ini lagi
    echo.
    pause
    exit /b 1
)
echo ✅ Docker Desktop jalan
echo.

REM Cek apakah di folder yang benar
if not exist "backend" (
    echo ❌ GAGAL: Folder backend tidak ditemukan!
    echo.
    echo 💡 SOLUSI:
    echo    Pastikan kamu jalankan script ini di folder:
    echo    c:\user-identity-layanan
    echo.
    pause
    exit /b 1
)
echo ✅ Folder project benar
echo.

echo [STEP 2] Login ke Docker Hub...
echo.
docker login
if %errorlevel% neq 0 (
    echo.
    echo ❌ GAGAL: Login Docker Hub gagal!
    echo.
    echo 💡 SOLUSI:
    echo    1. Pastikan username dan password benar
    echo    2. Cek koneksi internet
    echo    3. Coba lagi
    echo.
    pause
    exit /b 1
)
echo.
echo ✅ Login berhasil
echo.

echo ═══════════════════════════════════════════════════
echo    📦 BUILDING IMAGES (Estimasi: 5-10 menit)
echo ═══════════════════════════════════════════════════
echo.

REM Build Backend
echo [STEP 3] Building Backend...
cd backend
docker build -t noivira124/user-identity-backend:latest .
if %errorlevel% neq 0 (
    echo.
    echo ❌ GAGAL: Build backend gagal!
    cd ..
    pause
    exit /b 1
)
echo ✅ Backend build sukses
echo.

echo [STEP 4] Uploading Backend ke Docker Hub...
docker push noivira124/user-identity-backend:latest
if %errorlevel% neq 0 (
    echo.
    echo ❌ GAGAL: Upload backend gagal!
    cd ..
    pause
    exit /b 1
)
echo ✅ Backend upload sukses
echo.

REM Build Frontend
echo [STEP 5] Building Frontend...
cd ..\frontend
docker build -t noivira124/user-identity-frontend:latest .
if %errorlevel% neq 0 (
    echo.
    echo ❌ GAGAL: Build frontend gagal!
    cd ..
    pause
    exit /b 1
)
echo ✅ Frontend build sukses
echo.

echo [STEP 6] Uploading Frontend ke Docker Hub...
docker push noivira124/user-identity-frontend:latest
if %errorlevel% neq 0 (
    echo.
    echo ❌ GAGAL: Upload frontend gagal!
    cd ..
    pause
    exit /b 1
)
echo ✅ Frontend upload sukses
echo.

cd ..

echo.
echo ═══════════════════════════════════════════════════
echo    ✅ SUKSES! IMAGES SUDAH DIUPLOAD KE DOCKER HUB
echo ═══════════════════════════════════════════════════
echo.
echo 📦 Images yang sudah diupload:
echo    • noivira124/user-identity-backend:latest
echo    • noivira124/user-identity-frontend:latest
echo.
echo 🎯 LANGKAH SELANJUTNYA:
echo.
echo 1. Login ke aaPanel: https://panel.queenifyofficial.site
echo.
echo 2. Upload 2 file ke server (folder: /www/wwwroot/user-identity-layanan):
echo    • docker-compose.production.yml (rename jadi docker-compose.yml)
echo    • deploy-server-simple.sh
echo.
echo 3. Buka Terminal di aaPanel, jalankan:
echo    cd /www/wwwroot/user-identity-layanan
echo    chmod +x deploy-server-simple.sh
echo    ./deploy-server-simple.sh
echo.
echo 4. Baca file DEPLOY-SIMPLE.md untuk setup domain lengkap
echo.
echo ═══════════════════════════════════════════════════
echo.

pause
