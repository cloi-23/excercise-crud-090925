#!/bin/bash

echo "🚀 Starting Simple-CRUD development environment..."

# -------------------------------
# Optional: Start MongoDB (uncomment if needed)
# -------------------------------
# mongod --dbpath /path/to/your/mongo/data --fork --logpath /path/to/your/mongo/log/mongod.log
# sleep 3

# -------------------------------
# Backend
# -------------------------------
cd backend-server || exit

if [ ! -d "node_modules" ]; then
  npm install
fi

npm run start:dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# -------------------------------
# Frontend
# -------------------------------
cd ../web-client || exit

if [ ! -d "node_modules" ]; then
  npm install
fi

npm start &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# -------------------------------
# Trap Ctrl+C to kill both processes
# -------------------------------
cleanup() {
  echo ""
  echo "Stopping backend and frontend..."
  kill $BACKEND_PID $FRONTEND_PID
  exit 0
}

trap cleanup SIGINT

# -------------------------------
# Wait for both processes
# -------------------------------
wait $BACKEND_PID $FRONTEND_PID
