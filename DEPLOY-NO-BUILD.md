# Deploy Tanpa Build di Server aaPanel

## Workflow Deployment

```
Local (Windows) → Build Image → Push to Docker Hub → Server aaPanel → Pull & Run
```

## Step 1: Setup Docker Hub

1. **Buat akun di Docker Hub**: https://hub.docker.com/
2. **Catat username** (contoh: `johndoe`)

## Step 2: Build & Push Image dari Local Windows

1. **Edit file build-and-push.ps1**:
   - Ganti `$DOCKER_USER = "yourusername"` dengan username Docker Hub kamu
   
2. **Edit docker-compose.production.yml**:
   - Ganti `yourusername/user-identity-backend:latest` dengan `<dockerhub-username>/user-identity-backend:latest`
   - Ganti `yourusername/user-identity-frontend:latest` dengan `<dockerhub-username>/user-identity-frontend:latest`

3. **Jalankan build script di PowerShell**:
   ```powershell
   cd c:\user-identity-layanan
   .\build-and-push.ps1
   ```
   
   Script akan:
   - Login ke Docker Hub
   - Build image backend & frontend
   - Push ke Docker Hub
   - Proses ~5-10 menit tergantung koneksi

## Step 3: Upload ke Server aaPanel

1. **Login ke aaPanel**: https://panel.queenifyofficial.site/

2. **Buka File Manager**:
   - Masuk ke `/www/wwwroot/`
   
3. **Upload file**:
   - Upload `docker-compose.production.yml` (rename jadi `docker-compose.yml`)
   - Buat folder `data` (untuk database)

4. **Set Permission**:
   - Folder `data`: 755
   - `docker-compose.yml`: 644

## Step 4: Deploy di Server

### Via aaPanel Terminal / SSH:

```bash
# SSH ke server
ssh root@your-server-ip

# Masuk ke folder project
cd /www/wwwroot/user-identity-layanan

# Pull images dari Docker Hub (tanpa build!)
docker-compose pull

# Start containers
docker-compose up -d

# Cek status
docker ps

# Cek logs
docker-compose logs -f
```

**Selesai!** Backend di port 3040, Frontend di port 8080.

## Step 5: Setup Reverse Proxy di aaPanel

### Backend (api.queenifyofficial.site)

1. **Website** → **Add Site**:
   - Domain: `api.queenifyofficial.site`
   - PHP: Disable
   - Database: No

2. **Edit Site Config**:
   - Website → `api.queenifyofficial.site` → **Config File**
   - Ganti isi dengan:

```nginx
server {
    listen 80;
    server_name api.queenifyofficial.site;
    
    # Redirect HTTP to HTTPS (setelah SSL aktif)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://127.0.0.1:3040;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers (jika diperlukan)
        add_header Access-Control-Allow-Origin https://app.queenifyofficial.site always;
        add_header Access-Control-Allow-Methods "GET, POST, PATCH, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
    }
}
```

3. **Enable SSL**:
   - Website → `api.queenifyofficial.site` → **SSL**
   - Let's Encrypt → Apply
   - Uncomment redirect di config (baris `return 301...`)

### Frontend (app.queenifyofficial.site)

1. **Website** → **Add Site**:
   - Domain: `app.queenifyofficial.site`

2. **Edit Site Config**:

```nginx
server {
    listen 80;
    server_name app.queenifyofficial.site;
    
    # Redirect HTTP to HTTPS
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cache
        proxy_cache_bypass $http_upgrade;
        proxy_buffering on;
        proxy_cache_valid 200 1d;
    }
}
```

3. **Enable SSL** (sama seperti backend)

## Step 6: Testing

```bash
# Test backend
curl https://api.queenifyofficial.site/health
# Expect: {"status":"ok"}

# Test frontend
curl -I https://app.queenifyofficial.site
# Expect: 200 OK

# Test login
curl -X POST https://api.queenifyofficial.site/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mail.com","password":"admin123"}'
```

## Update Deployment (Ketika Ada Perubahan Code)

1. **Di Local Windows**:
   ```powershell
   # Edit code sesuai kebutuhan
   
   # Build & push ulang
   .\build-and-push.ps1
   ```

2. **Di Server aaPanel**:
   ```bash
   cd /www/wwwroot/user-identity-layanan
   
   # Pull image terbaru
   docker-compose pull
   
   # Restart dengan image baru
   docker-compose up -d
   
   # Cek logs
   docker-compose logs -f
   ```

## Maintenance Commands

```bash
# Restart semua container
docker-compose restart

# Stop semua
docker-compose down

# View logs real-time
docker-compose logs -f

# View logs specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Remove semua (danger!)
docker-compose down -v

# Check disk usage
docker system df

# Cleanup unused images
docker image prune -a
```

## Troubleshooting

### Container tidak start
```bash
docker ps -a
docker logs user-identity-backend
docker logs user-identity-frontend
```

### Port sudah digunakan
```bash
netstat -tlnp | grep 3040
netstat -tlnp | grep 8080

# Kill process
kill -9 <PID>
```

### Database error
```bash
# Cek permission
ls -la /www/wwwroot/user-identity-layanan/data/

# Set permission
chmod 777 /www/wwwroot/user-identity-layanan/data/
```

### CORS Error
- Pastikan backend CORS allow origin sudah benar
- Cek nginx config reverse proxy sudah add CORS headers

### Image pull error
```bash
# Login to Docker Hub di server
docker login

# Pull manual
docker pull yourusername/user-identity-backend:latest
docker pull yourusername/user-identity-frontend:latest
```

## Keuntungan Metode Ini

✅ **Tidak perlu build di server** (hemat resource server)  
✅ **Build sekali, deploy berkali-kali**  
✅ **Rollback mudah** (tinggal ganti tag version)  
✅ **CI/CD ready** (bisa auto-build via GitHub Actions)  
✅ **Image tersimpan di Docker Hub** (backup otomatis)

## Optional: GitHub Actions Auto-Build

Buat file `.github/workflows/docker-build.yml` untuk auto-build setiap push:

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push Backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: yourusername/user-identity-backend:latest
      
      - name: Build and push Frontend
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: yourusername/user-identity-frontend:latest
```
