#!/bin/bash
# Script untuk server Linux/aaPanel
# Tidak perlu build, hanya pull image dari Docker Hub

echo "=== Deploying User Identity Service ==="

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker not found! Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose not found! Please install Docker Compose first."
    exit 1
fi

# Pull latest images from Docker Hub
echo "Pulling latest images from Docker Hub..."
docker-compose pull

# Stop old containers
echo "Stopping old containers..."
docker-compose down

# Start new containers
echo "Starting containers..."
docker-compose up -d

# Show status
echo ""
echo "=== Container Status ==="
docker-compose ps

echo ""
echo "=== Logs (Ctrl+C to exit) ==="
docker-compose logs -f
