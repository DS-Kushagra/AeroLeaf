# Instructions for Running AeroLeaf Application

This document provides detailed instructions for setting up and running each component of the AeroLeaf application.

## Prerequisites

Before starting, ensure you have the following installed:

- Node.js (v16 or higher)
- Python (v3.8 or higher) with pip
- MongoDB (local or cloud)
- Git

## Project Structure

The AeroLeaf project consists of several components:

- **Frontend**: React.js application
- **Backend**: Node.js/Express API server
- **Blockchain**: Hardhat-based Ethereum contracts
- **ML**: Python scripts for NDVI processing and carbon estimation

## Setup Instructions

### 1. Clone the Repository

```powershell
git clone https://github.com/your-username/aeroleaf.git
cd aeroleaf
```

### 2. Install Dependencies

First, install the main project dependencies:

```powershell
npm install
```

Then install dependencies for each component:

**Backend:**

```powershell
cd backend
npm install
cd ..
```

**Frontend:**

```powershell
cd frontend/aeroleaf-frontend
npm install
cd ../..
```

**Blockchain:**

```powershell
cd blockchain
npm install
cd ..
```

**ML:**

```powershell
cd ml
pip install -r requirements.txt
cd ..
```

### 3. Environment Configuration

Create or update `.env` files in both the root directory and the backend directory with the following values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/aeroleaf
FIREBASE_API_KEY= YOUR FIREBASE API KEY
EARTH_ENGINE_API_KEY= YOUR PROJECT(s) API KEY
MAPBOX_TOKEN=pk.eyJ1IjoiYWVyb2xlYWYiLCJhIjoiY2xyMWttZGZxMGNkMjJqbnZ1NzJ2OTljbSJ9.FR74uazSLJM8FeH1fR8OSQ
```

### 4. Initialize Database

Run the database initialization script:

```powershell
cd backend/services
node initData.js
cd ../..
```

This will load sample data into Firebase.

### 5. Running the Application

Use the provided batch files to run the application:

**Complete setup and database initialization:**

```powershell
.\setup.bat
```

**Start backend server only:**

```powershell
.\start-backend.bat
```

**Start frontend server only:**

```powershell
.\start-frontend.bat
```

**Start both frontend and backend:**

```powershell
.\start-all.bat
```

## Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/docs

## Troubleshooting

### Common Issues and Solutions

1. **Database initialization script error (file not found):**

   If you encounter errors about missing data files, check that the path to the reforestation_sites.json file is correct. The file should be in the `data` directory at the root of the project.

2. **Firebase connection issues:**

   Verify that the firebaseServiceKey.json file is present in the backend directory.

3. **Backend fails to start:**

   - Check that all dependencies are installed
   - Verify the .env file has proper values
   - Make sure port 5000 is not in use by another application

4. **Frontend build errors:**

   - Check for any dependency version conflicts
   - Make sure React and other frontend dependencies are properly installed
   - Verify that the Vite configuration is correct

5. **CORS issues when connecting frontend to backend:**

   If you see CORS errors in the browser console, verify that the backend CORS middleware is properly configured in app.js.

6. **API Endpoint Not Found errors:**

   If you see "API endpoint not found" errors, particularly in the Swagger UI, this might be because the 404 handler middleware is being applied before some routes are defined. Fix the order of middleware in the app.js file by placing the Swagger UI setup before the 404 handler.

7. **ReviewSites.jsx Component Error:**

   The ReviewSites component may throw an error about 'return' being outside of a function. This is because the original code was written in a script-like style instead of as a proper React component. Fix this by rewriting it as a proper functional component with useState and useEffect hooks.

8. **Blank/Empty Frontend Pages:**

   When pages appear blank, check:

   - API connectivity (look at the StatusBanner component)
   - React component errors in the browser console
   - Configure the Vite proxy settings in vite.config.js to proxy API requests to the backend
   - Ensure API service is using relative paths (/api/...) that will be proxied correctly

9. **ML Module Errors:**

   Make sure you have the correct Python version and all required packages installed.

10. **Browser Console Network Errors:**

    If you see 404 or 500 errors in the browser console for API requests, check that you have:

    - Backend server running on the correct port
    - API endpoints properly implemented
    - Proxy configuration in vite.config.js to route /api requests to the backend
