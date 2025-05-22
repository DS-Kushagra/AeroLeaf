# AeroLeaf Installation Guide

This comprehensive guide will walk you through the complete installation and setup process for the AeroLeaf carbon credit platform.

## Table of Contents

- [System Requirements](#system-requirements)
- [Prerequisites](#prerequisites)
- [Step-by-Step Installation](#step-by-step-installation)
- [Configuration](#configuration)
- [Verify Installation](#verify-installation)
- [Deployment Options](#deployment-options)
- [Troubleshooting](#troubleshooting)

## System Requirements

### Hardware Requirements

- **CPU**: Dual-core processor (2.0 GHz or higher)
- **RAM**: Minimum 4GB, Recommended 8GB or more
- **Disk Space**: At least 5GB of free storage

### Software Requirements

- **Operating System**:
  - Windows 10/11
  - macOS 10.15 or higher
  - Ubuntu 20.04 or higher
- **Node.js**: v16.x or higher
- **Python**: v3.8 or higher
- **Git**: Latest stable version
- **Web Browser**: Chrome, Firefox, Edge (latest versions)

## Prerequisites

Before you begin the installation, make sure you have the following installed on your system:

### 1. Node.js and npm

Download and install from [nodejs.org](https://nodejs.org/).

Verify the installation:

```bash
node --version
npm --version
```

### 2. Python and pip

Download and install from [python.org](https://python.org/).

Verify the installation:

```bash
python --version
pip --version
```

### 3. Git

Download and install from [git-scm.com](https://git-scm.com/).

Verify the installation:

```bash
git --version
```

### 4. Firebase Account (Optional for Development)

If you plan to use your own Firebase instance:

1. Create a Firebase account at [firebase.google.com](https://firebase.google.com/)
2. Create a new project
3. Set up Firestore Database
4. Download the service account key (JSON file)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/aeroleaf/carbon-credit-platform.git
cd aeroleaf
```

### 2. Run the Setup Script

The setup script will install all necessary dependencies, initialize the database, and compile smart contracts.

**Windows:**

```bash
./setup.bat
```

**macOS/Linux:**

```bash
chmod +x ./setup.sh
./setup.sh
```

This script performs the following actions:

- Installs Node.js dependencies for all project components
- Installs required Python packages for ML components
- Initializes the Firebase database with sample data
- Compiles and deploys smart contracts to a local test network
- Sets up environment variables

### 3. Manual Setup (Alternative to Setup Script)

If you prefer to set up components manually or if you encounter issues with the setup script, follow these steps:

#### 3.1. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

#### 3.2. Install Frontend Dependencies

```bash
cd frontend/aeroleaf-frontend
npm install
cd ../..
```

#### 3.3. Install Blockchain Dependencies

```bash
cd blockchain
npm install
cd ..
```

#### 3.4. Install ML Dependencies

```bash
cd ml
pip install -r requirements.txt
cd ..
```

#### 3.5. Initialize Database

```bash
cd backend/services
node initData.js
cd ../..
```

## Configuration

### Environment Variables

Create the following `.env` files:

#### Root Directory `.env`

```
PORT=5000
NODE_ENV=development
```

#### Backend Directory `.env`

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/aeroleaf
FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
EARTH_ENGINE_API_KEY=YOUR_EARTH_ENGINE_API_KEY
MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN
```

Replace `YOUR_FIREBASE_API_KEY`, `YOUR_EARTH_ENGINE_API_KEY`, and `YOUR_MAPBOX_TOKEN` with your actual API keys.

### Firebase Configuration

1. Place your `firebaseServiceKey.json` in the `backend` directory
2. Update Firebase configuration in `backend/firebase/index.js` if necessary

### Blockchain Configuration

Update the network configuration in `blockchain/hardhat.config.js` if needed.

## Verify Installation

### 1. Start the Backend Server

```bash
./start-backend.bat
```

The server should start on http://localhost:5000.

### 2. Start the Frontend Development Server

```bash
./start-frontend.bat
```

The frontend development server should start on http://localhost:5173.

### 3. Test the Application

Open a web browser and navigate to http://localhost:5173. You should see the AeroLeaf home page.

## Deployment Options

### Local Development

For local development, use the included scripts:

```bash
./start-all.bat  # Starts both frontend and backend
```

### Production Deployment

For production deployment, follow these steps:

1. **Build the Frontend**

```bash
cd frontend/aeroleaf-frontend
npm run build
cd ../..
```

2. **Set Environment Variables**

Update `.env` files to use production values.

3. **Deploy Backend**

Host the Node.js application using a service like:

- AWS Elastic Beanstalk
- Heroku
- DigitalOcean
- Google Cloud Run

4. **Deploy Frontend**

Host the static files from `frontend/aeroleaf-frontend/dist` using:

- Netlify
- Vercel
- AWS S3 + CloudFront
- Firebase Hosting

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

- Check that Firebase credentials are correctly configured
- Verify that the `firebaseServiceKey.json` file is in the backend directory

#### 2. Node.js Dependency Issues

```bash
cd backend
rm -rf node_modules
npm install
cd ../frontend/aeroleaf-frontend
rm -rf node_modules
npm install
```

#### 3. Port Conflicts

If port 5000 or 5173 is already in use:

- Change the port in the `.env` file
- Update the proxy settings in `frontend/aeroleaf-frontend/vite.config.js`

#### 4. CORS Issues

If you see CORS errors in the browser console:

- Check that the backend CORS middleware is properly configured
- Verify that the Vite proxy settings are correct

For more troubleshooting information, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).
