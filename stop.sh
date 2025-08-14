#!/bin/bash

echo "🛑 Stopping ODOT Application..."
echo "==============================="

# Stop all services
docker-compose down

echo "✅ ODOT Application stopped!"
echo ""
echo "To start again, run: ./start.sh"
echo "To remove all data, run: docker-compose down --volumes"
