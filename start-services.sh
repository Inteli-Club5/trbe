#!/bin/bash

# Start Twitter auth service in the background
echo "Starting Twitter auth service on port 5000..."
cd /app/src/backend/auth
npx ts-node src/index.ts &
TWITTER_AUTH_PID=$!

# Wait a moment for the auth service to start
sleep 2

# Start the main backend service
echo "Starting main backend service..."
cd /app/src/backend
node server.js &
MAIN_BACKEND_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo "Shutting down services..."
    kill $TWITTER_AUTH_PID 2>/dev/null
    kill $MAIN_BACKEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "All services started successfully!"
echo "Twitter Auth Service PID: $TWITTER_AUTH_PID"
echo "Main Backend Service PID: $MAIN_BACKEND_PID"

# Wait for all background processes
wait 