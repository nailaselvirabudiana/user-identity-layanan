# 🚀 QUICK START - Deploy Aplikasi User Identity

## Ringkasan Super Cepat

```
1. Daftar Docker Hub (gratis): https://hub.docker.com
2. Install Docker Desktop: https://docker.com/products/docker-desktop
3. Edit username di build-and-push.ps1 & docker-compose.production.yml
4. Run: .\build-and-push.ps1
5. Upload docker-compose.yml & deploy-server.sh ke server
6. Run di server: ./deploy-server.sh
7. Setup domain di aaPanel
8. DONE! ✅
```

---

## 📁 File Penting

| File | Kegunaan | Edit? |
|------|----------|-------|
| `build-and-push.ps1` | Build & upload dari Windows | ✅ Ganti username |
| `docker-compose.production.yml` | Config untuk server | ✅ Ganti username |
| `deploy-server.sh` | Deploy otomatis di server | ❌ Tidak perlu |
| `DEPLOY-SIMPLE.md` | Panduan lengkap untuk pemula | ❌ Baca aja |

---

## 🎯 Command Cheat Sheet

### Windows (PowerShell)
```powershell
cd c:\user-identity-layanan
.\build-and-push.ps1                    # Build & upload
docker login                            # Login Docker Hub
```

### Server Linux (Terminal aaPanel)
```bash
cd /www/wwwroot/user-identity-layanan
./deploy-server.sh                      # Deploy/Update
docker ps                               # Lihat status
docker-compose logs -f                  # Lihat logs
docker-compose restart                  # Restart
docker-compose down                     # Stop
docker-compose up -d                    # Start
```

---

## 🔗 URL Setelah Deploy

| Service | Local | Production |
|---------|-------|------------|
| Backend API | http://localhost:3040 | https://api.queenifyofficial.site |
| Frontend | http://localhost:8080 | https://app.queenifyofficial.site |
| Health Check | /health | https://api.queenifyofficial.site/health |

---

## ⚡ Update Aplikasi

### 1-2-3 Update:
1. **Windows**: `.\build-and-push.ps1`
2. **Server**: `./deploy-server.sh`
3. **Done!** ✅

---

## 📖 Baca Panduan Lengkap

Untuk step-by-step detail, buka: **DEPLOY-SIMPLE.md**

---

**Selamat Deploy!** 🎉
