@echo off
echo ===================================
echo AeroLeaf Setup and Initialization
echo ===================================
echo.

echo Step 1: Installing dependencies...
call npm install
cd backend
call npm install express cors dotenv firebase-admin swagger-ui-express swagger-jsdoc mongoose
cd ../frontend/aeroleaf-frontend
call npm install react-router-dom @mui/material @emotion/react @emotion/styled @nivo/line leaflet react-leaflet
cd ../../blockchain
call npm install @openzeppelin/contracts
cd ..

echo.
echo Step 2: Initializing database...
cd backend
node services/initData.js
cd ..

echo.
echo Step 3: Compiling smart contracts...
cd blockchain
npx hardhat compile
cd ..

echo.
echo ===================================
echo Setup complete! 
echo ===================================
echo.
echo To start the application:
echo.
echo 1. Run start-backend.bat
echo 2. Run start-frontend.bat in another terminal window
echo.
echo You can then access:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:5000/api
echo - API Documentation: http://localhost:5000/docs
echo.
pause
