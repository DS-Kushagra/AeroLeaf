@echo off
echo Starting AeroLeaf Platform (All Services)...

REM Check if backend dependencies are installed
if not exist "backend\node_modules\" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Check if frontend dependencies are installed
if not exist "frontend\aeroleaf-frontend\node_modules\" (
    echo Installing frontend dependencies...
    cd frontend\aeroleaf-frontend
    call npm install
    cd ..\..
)

echo Starting backend server...
start cmd /k "cd backend && node app.js"

echo Waiting for backend to initialize (5 seconds)...
timeout /t 5 /nobreak > nul

echo Starting frontend server...
start cmd /k "cd frontend\aeroleaf-frontend && npm run dev"

echo Services started successfully!
echo.
echo Backend API: http://localhost:5000/api
echo API Documentation: http://localhost:5000/docs
echo Frontend Application: http://localhost:5173
echo.
