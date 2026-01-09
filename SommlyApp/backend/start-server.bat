@echo off
echo ========================================
echo Starting Sommly Backend Server
echo ========================================
echo.
echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server on port 4242...
echo Make sure this window stays open!
echo.
node server.js

