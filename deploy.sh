#!/bin/bash

# Ensure the correct node version is selected
export NODE_VERSION=18

# Clean up any previous builds
echo "Cleaning up previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

# Deploy to Vercel (if vercel CLI is installed)
if command -v vercel &> /dev/null
then
    echo "Deploying to Vercel..."
    vercel --prod
else
    echo "Vercel CLI not found. Please install it with 'npm i -g vercel' or deploy manually."
    echo "You can deploy by visiting https://vercel.com/new and importing your repository."
fi