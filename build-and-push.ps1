# Build dan Push Docker Images ke Docker Hub
# Jalankan di PowerShell Windows

Write-Host "=== Building & Pushing Docker Images ===" -ForegroundColor Cyan

# Ganti dengan username Docker Hub kamu
$DOCKER_USER = "noivira124"
$VERSION = "latest"

Write-Host "`nStep 1: Login to Docker Hub" -ForegroundColor Yellow
docker login

Write-Host "`nStep 2: Building Backend Image..." -ForegroundColor Yellow
Set-Location backend
docker build -t ${DOCKER_USER}/user-identity-backend:${VERSION} .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nStep 3: Pushing Backend Image..." -ForegroundColor Yellow
docker push ${DOCKER_USER}/user-identity-backend:${VERSION}
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend push failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nStep 4: Building Frontend Image..." -ForegroundColor Yellow
Set-Location ../frontend
docker build -t ${DOCKER_USER}/user-identity-frontend:${VERSION} .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nStep 5: Pushing Frontend Image..." -ForegroundColor Yellow
docker push ${DOCKER_USER}/user-identity-frontend:${VERSION}
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend push failed!" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host "`n=== SUCCESS ===" -ForegroundColor Green
Write-Host "Images pushed to Docker Hub:" -ForegroundColor Green
Write-Host "  - ${DOCKER_USER}/user-identity-backend:${VERSION}" -ForegroundColor White
Write-Host "  - ${DOCKER_USER}/user-identity-frontend:${VERSION}" -ForegroundColor White
Write-Host "`nNext: Copy docker-compose.production.yml to server and run:" -ForegroundColor Cyan
Write-Host "  docker-compose -f docker-compose.production.yml up -d" -ForegroundColor White
