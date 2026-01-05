# Panduan Deploy ke aaPanel dengan Docker

## Persiapan di Local

1. **Update API_BASE di frontend** (jika deploy ke domain production):
   - Edit `frontend/js/auth.js`
   - Ganti `API_BASE` dari `http://localhost:3040` ke `https://panel.queenifyofficial.site/api` atau URL backend production

2. **Ganti JWT_SECRET di docker-compose.yml**:
   - Edit `docker-compose.yml`
   - Ganti `your-secret-key-change-this` dengan secret yang kuat

## Deploy ke Server aaPanel

### Opsi 1: Upload & Build di Server

1. **Upload project ke server**:
   ```bash
   # Compress folder
   tar -czf user-identity-layanan.tar.gz user-identity-layanan/
   
   # Upload via SFTP/SCP ke server
   scp user-identity-layanan.tar.gz user@your-server-ip:/www/wwwroot/
   ```

2. **SSH ke server aaPanel**:
   ```bash
   ssh user@your-server-ip
   cd /www/wwwroot/
   tar -xzf user-identity-layanan.tar.gz
   cd user-identity-layanan
   ```

3. **Build & Run dengan Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```

4. **Cek container berjalan**:
   ```bash
   docker ps
   docker logs user-identity-backend
   docker logs user-identity-frontend
   ```

### Opsi 2: Build Image di Local, Push ke Registry

1. **Build images**:
   ```bash
   # Backend
   cd backend
   docker build -t your-dockerhub-username/user-identity-backend:latest .
   
   # Frontend
   cd ../frontend
   docker build -t your-dockerhub-username/user-identity-frontend:latest .
   ```

2. **Push to Docker Hub**:
   ```bash
   docker login
   docker push your-dockerhub-username/user-identity-backend:latest
   docker push your-dockerhub-username/user-identity-frontend:latest
   ```

3. **Di server, pull & run**:
   ```bash
   docker pull your-dockerhub-username/user-identity-backend:latest
   docker pull your-dockerhub-username/user-identity-frontend:latest
   docker-compose up -d
   ```

## Setup Nginx Reverse Proxy di aaPanel

1. **Login ke aaPanel**: https://panel.queenifyofficial.site/

2. **Buat Website Baru**:
   - Website → Add site
   - Domain: `api.queenifyofficial.site` (untuk backend)
   - Domain: `app.queenifyofficial.site` (untuk frontend)

3. **Setup Reverse Proxy untuk Backend**:
   - Website → `api.queenifyofficial.site` → Config
   - Tambahkan di nginx config:
   ```nginx
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
   }
   ```

4. **Setup Reverse Proxy untuk Frontend**:
   - Website → `app.queenifyofficial.site` → Config
   - Tambahkan:
   ```nginx
   location / {
       proxy_pass http://127.0.0.1:8080;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

5. **Enable SSL/HTTPS**:
   - Website → SSL → Let's Encrypt
   - Apply untuk kedua domain

6. **Update CORS di Backend**:
   - Edit `backend/src/server.js` tambahkan allowed origins:
   ```javascript
   app.use(cors({
       origin: ['https://app.queenifyofficial.site', 'http://localhost:5500']
   }));
   ```

## Port Mapping

- Backend API: `localhost:3040` → `https://api.queenifyofficial.site`
- Frontend: `localhost:8080` → `https://app.queenifyofficial.site`

## Testing

1. **Test Backend**:
   ```bash
   curl https://api.queenifyofficial.site/health
   ```

2. **Test Frontend**:
   - Buka browser: https://app.queenifyofficial.site

## Maintenance Commands

```bash
# Restart containers
docker-compose restart

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Update & rebuild
docker-compose down
docker-compose up -d --build

# Remove all
docker-compose down -v
```

## Troubleshooting

### Container tidak start
```bash
docker ps -a
docker logs user-identity-backend
docker logs user-identity-frontend
```

### Database error
```bash
# Masuk ke container backend
docker exec -it user-identity-backend sh
ls -la database.sqlite
```

### Port sudah terpakai
```bash
# Cek port
netstat -tulpn | grep 3040
netstat -tulpn | grep 8080

# Kill process
kill -9 <PID>
```
