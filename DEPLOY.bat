@echo off
echo ======================================
echo   DEPLOY USER IDENTITY SERVICE
echo ======================================
echo.

REM Cek apakah Docker Desktop sudah jalan
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Desktop tidak jalan!
    echo.
    echo Solusi:
    echo 1. Buka Docker Desktop
    echo 2. Tunggu sampai ada tulisan "Docker Desktop is running"
    echo 3. Jalankan script ini lagi
    echo.
    pause
    exit /b 1
)

echo [OK] Docker Desktop sudah jalan
echo.

REM Cek apakah file sudah diedit
findstr /C:"noivira124" build-and-push.ps1 >nul 2>&1
if %errorlevel% equ 0 (
    echo [PERINGATAN] Username belum diganti!
    echo.
    echo Langkah:
    echo 1. Edit file: build-and-push.ps1
    echo 2. Ganti "yourusername" dengan username Docker Hub kamu
    echo 3. Simpan (Ctrl+S)
    echo 4. Jalankan script ini lagi
    echo.
    pause
    exit /b 1
)

echo [OK] File sudah diedit
echo.
echo Proses akan dimulai...
echo Estimasi waktu: 5-10 menit
echo.
pause

REM Jalankan PowerShell script
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-and-push.ps1"

if %errorlevel% equ 0 (
    echo.
    echo ======================================
    echo   BUILD SUKSES!
    echo ======================================
    echo.
    echo Langkah selanjutnya:
    echo 1. Upload file ke server aaPanel:
    echo    - docker-compose.production.yml (rename jadi docker-compose.yml^)
    echo    - deploy-server.sh
    echo 2. Jalankan di server: ./deploy-server.sh
    echo.
    echo Baca: DEPLOY-SIMPLE.md untuk panduan lengkap
    echo.
) else (
    echo.
    echo ======================================
    echo   BUILD GAGAL!
    echo ======================================
    echo.
    echo Solusi:
    echo 1. Cek koneksi internet
    echo 2. Pastikan sudah login Docker Hub
    echo 3. Coba lagi
    echo.
)

pause
