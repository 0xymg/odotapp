#!/bin/bash

echo "🚀 Starting ODOT Application..."
echo "================================="

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove any existing containers and images (optional, for clean build)
echo "🧹 Cleaning up old images..."
docker-compose down --rmi all --volumes --remove-orphans 2>/dev/null || true

# Build and start all services
echo "🔨 Building and starting all services..."
docker-compose up --build -d

# Wait a moment for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Show running containers
echo "📋 Running containers:"
docker-compose ps

echo ""
echo "✅ ODOT Application is now running!"
echo "================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔐 User Service: http://localhost:3001"
echo "📝 Todo Service: http://localhost:3002"
echo "🗄️  User Database: localhost:5434"
echo "🗄️  Todo Database: localhost:5435"
echo ""
echo "To stop the application, run: docker-compose down"
echo "To view logs, run: docker-compose logs -f"
