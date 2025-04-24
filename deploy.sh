#!/bin/bash

# Print commands for debugging
set -x

# Stop on error
set -e

echo "🚀 Building ConnectUp for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build frontend and backend
echo "🏗️ Building applications..."
npm run build

# Start the application in production mode
echo "🌐 Starting the application in production mode..."
npm run start:prod

echo "✅ Deployment completed! The application is now running in production mode." 