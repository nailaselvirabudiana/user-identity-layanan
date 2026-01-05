#!/bin/bash

# ========================================
#  DEPLOY USER IDENTITY SERVICE
#  Untuk Server Linux / aaPanel
# ========================================

echo "========================================"
echo "   DEPLOY USER IDENTITY SERVICE"
echo "========================================"
echo ""

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fungsi untuk print dengan warna
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Cek Docker installed
if ! command -v docker &> /dev/null; then
    print_error "Docker tidak terinstall!"
    echo ""
    echo "Install Docker dulu:"
    echo "  curl -fsSL https://get.docker.com | sh"
    exit 1
fi

print_success "Docker sudah terinstall"

# Cek Docker Compose installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose tidak terinstall!"
    echo ""
    echo "Install Docker Compose dulu:"
    echo "  apt install docker-compose -y"
    exit 1
fi

print_success "Docker Compose sudah terinstall"
echo ""

# Cek file docker-compose.yml
if [ ! -f "docker-compose.yml" ]; then
    print_error "File docker-compose.yml tidak ditemukan!"
    echo ""
    echo "Pastikan file sudah diupload ke folder ini"
    exit 1
fi

print_success "File docker-compose.yml ditemukan"
echo ""

# Cek apakah username sudah diganti
if grep -q "yourusername" docker-compose.yml; then
    print_error "Username belum diganti di docker-compose.yml!"
    echo ""
    echo "Edit file docker-compose.yml:"
    echo "  nano docker-compose.yml"
    echo ""
    echo "Ganti 'yourusername' dengan username Docker Hub kamu"
    echo "Simpan: Ctrl+O, Enter, Ctrl+X"
    exit 1
fi

print_success "Username sudah diganti"
echo ""

print_info "Proses deploy akan dimulai..."
echo "Estimasi waktu: 2-5 menit"
echo ""

read -p "Lanjutkan? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Deploy dibatalkan"
    exit 0
fi

echo ""
echo "========================================="
echo "  STEP 1: Login Docker Hub"
echo "========================================="
echo ""

docker login

if [ $? -ne 0 ]; then
    print_error "Login Docker Hub gagal!"
    exit 1
fi

print_success "Login berhasil"
echo ""

echo "========================================="
echo "  STEP 2: Pull Images dari Docker Hub"
echo "========================================="
echo ""

docker-compose pull

if [ $? -ne 0 ]; then
    print_error "Pull images gagal!"
    echo ""
    echo "Solusi:"
    echo "1. Cek koneksi internet"
    echo "2. Pastikan images sudah dipush dari local"
    echo "3. Cek username di docker-compose.yml sudah benar"
    exit 1
fi

print_success "Pull images berhasil"
echo ""

echo "========================================="
echo "  STEP 3: Stop Container Lama"
echo "========================================="
echo ""

docker-compose down

print_success "Container lama sudah di-stop"
echo ""

echo "========================================="
echo "  STEP 4: Start Container Baru"
echo "========================================="
echo ""

docker-compose up -d

if [ $? -ne 0 ]; then
    print_error "Start container gagal!"
    echo ""
    echo "Cek logs:"
    echo "  docker-compose logs"
    exit 1
fi

print_success "Container berhasil di-start"
echo ""

# Tunggu sebentar agar container fully started
sleep 3

echo "========================================="
echo "  STATUS CONTAINER"
echo "========================================="
echo ""

docker-compose ps

echo ""
echo "========================================="
echo "  DEPLOY SUKSES!"
echo "========================================="
echo ""

print_success "Backend API: http://localhost:3040"
print_success "Frontend: http://localhost:8080"
echo ""

print_info "Test backend:"
echo "  curl http://localhost:3040/health"
echo ""

print_info "Lihat logs:"
echo "  docker-compose logs -f"
echo ""

print_info "Setup domain di aaPanel:"
echo "  - api.queenifyofficial.site -> port 3040"
echo "  - app.queenifyofficial.site -> port 8080"
echo ""

print_success "Baca DEPLOY-SIMPLE.md untuk setup domain lengkap"
echo ""
