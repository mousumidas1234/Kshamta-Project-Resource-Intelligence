#!/bin/bash

# Catch Ctrl+C (SIGINT) and SIGTERM to clean up all background processes
cleanup() {
    echo -e "\n\nStopping KSHAMTA services..."
    # Kill background tasks using their PIDs
    kill "$BACKEND_PID" 2>/dev/null
    kill "$FRONTEND_PID" 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "=========================================="
echo "      Starting KSHAMTA Application        "
echo "=========================================="

# 1. Start Backend API
echo "Starting Backend API on http://localhost:8000..."
cd "$(dirname "$0")/backend"
source .venv/bin/activate
uvicorn app.main:app --port 8000 --reload &
BACKEND_PID=$!

# Go back to root
cd ..

# 2. Start Frontend Dev Server
echo "Starting Frontend Dev Server on http://localhost:5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!

# Go back to root
cd ..

echo "=========================================="
echo "Services running. Press Ctrl+C to stop both."
echo "=========================================="

# Wait for both processes to terminate
wait $BACKEND_PID $FRONTEND_PID
