#!/bin/bash
echo "========================================"
echo "Starting Sommly Backend Server"
echo "========================================"
echo ""
echo "Checking if dependencies are installed..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

echo "Starting server on port 4242..."
echo "Make sure this terminal stays open!"
echo ""
node server.js

