# Project AeroLeaf 🌱

A blockchain-based platform to verify and trade carbon credits using satellite imagery and AI.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Quick Start Guide](#quick-start-guide)
- [Project Structure](#project-structure)
- [Recent Updates](#recent-updates)
- [Demo Accounts](#demo-accounts)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🌍 Overview

Project AeroLeaf is a comprehensive platform designed to bring transparency and reliability to the carbon credit market through a combination of cutting-edge technologies. Our mission is to enable trustworthy carbon offsetting by providing verifiable evidence of reforestation projects through satellite imagery analysis and blockchain-based validation.

**Our Vision:** To create a decentralized, transparent platform for tracking reforestation and trading carbon credits with real environmental impact.

## 🚀 Key Features

## 🚦 Quick Start Guide

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Git
- Windows, macOS, or Linux

### Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/aeroleaf/carbon-credit-platform.git
   cd aeroleaf
   ```

2. **Initial Setup**

   Run the setup script to install all dependencies, initialize the database, and compile smart contracts:

   ```bash
   ./setup.bat
   ```

3. **Starting the Application**

   **Option 1**: Start all services at once:

   ```bash
   ./start-all.bat
   ```

   **Option 2**: Start services separately:

   ```bash
   ./start-backend.bat
   ```

   In another terminal:

   ```bash
   ./start-frontend.bat
   ```

4. **Accessing the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - API Documentation: http://localhost:5000/docs

For more detailed setup instructions, see [INSTALLATION.md](./docs/INSTALLATION.md).

## 📝 Recent Updates

The following improvements were recently implemented:

1. **API Documentation Fix**: The Swagger UI now displays correctly at http://localhost:5000/docs

2. **Frontend API Service**: Added a centralized API service for frontend components to interact with the backend

3. **API Proxy Configuration**: The frontend's Vite config now proxies API requests to avoid CORS issues

4. **Status Banner**: Added a status banner to display API connection status and development mode information

5. **Component Fixes**: Corrected React component syntax in ReviewSites.jsx to use proper function components

6. **Enhanced Batch Scripts**: Updated start-all.bat with dependency checks and better sequencing

7. **Database Initialization**: Corrected paths in the database initialization script

8. **Animation Enhancement**: Integrated framer-motion for improved UI animations

For more detailed troubleshooting information, see [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md).

## 👥 Demo Accounts

Use these test accounts to explore different roles in the system:

1. **Investor Account:**

   - Email: alice@example.com
   - Password: password123
   - Role: Carbon credit buyer and investor in reforestation projects

2. **Landowner Account:**

   - Email: bob@example.com
   - Password: password123
   - Role: Owner of land used for reforestation projects

3. **Verifier Account:**
   - Email: charlie@example.com
   - Password: password123
   - Role: Independent verifier who confirms reforestation progress

## 📁 Project Structure

```
AeroLeaf/
├── frontend/               # React application with Vite
│   └── aeroleaf-frontend/  # Frontend source code
├── backend/                # Node.js Express server
│   ├── api/                # API endpoints
│   ├── controllers/        # Request handlers
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   └── services/           # Business logic
├── blockchain/             # Smart contract codebase
│   ├── contracts/          # Solidity smart contracts
│   └── test/               # Contract test scripts
├── ml/                     # Machine learning components
│   ├── data/               # Sentinel satellite imagery
│   └── results/            # Analysis outputs
├── data/                   # Sample data for development
├── docs/                   # Extended documentation
└── scripts/                # Utility scripts
```

## 💻 Technology Stack

### Frontend

- **Framework**: React.js with Vite
- **State Management**: Context API, React Hooks
- **UI Components**: Custom components with Tailwind CSS
- **Maps & Visualization**: Leaflet maps, Nivo charts, Three.js
- **Animation**: Framer Motion, GSAP

### Backend

- **Server**: Node.js, Express
- **Database**: Firebase/Firestore
- **Authentication**: Firebase Auth
- **API Documentation**: Swagger UI

### Blockchain

- **Smart Contracts**: Solidity (ERC-721)
- **Development Framework**: Hardhat
- **Network**: Polygon (for lower transaction fees)
- **Web3 Integration**: ethers.js

### Data & ML

- **Satellite Data**: Sentinel-2 imagery
- **Analysis**: NDVI processing, carbon estimation
- **Python Libraries**: numpy, matplotlib, scikit-learn
- **GIS Processing**: Earth Engine API

## Main Features

1. **Interactive Dashboard**

   - Real-time monitoring of reforestation sites
   - Comprehensive NDVI progress visualization
   - Carbon credit statistics and market trends

2. **Satellite-based Verification**

   - Time-series NDVI (Normalized Difference Vegetation Index) analysis
   - Before/after visual comparison of reforestation sites
   - Automated vegetation growth detection

3. **Blockchain Transparency**

   - Smart contract-based verification records
   - Carbon credits issued as NFTs with complete audit trail
   - Immutable record of verification history

4. **Carbon Credit Marketplace**

   - Buy, sell, and retire carbon credits from verified projects
   - Real-time pricing based on market demand
   - Direct connection between investors and landowners

5. **AI-Powered Analysis**
   - Machine learning algorithms for carbon sequestration estimation
   - Automated anomaly detection for site monitoring
   - Predictive analysis for reforestation project outcomes

## 📚 Documentation

Comprehensive documentation is available to help you understand and work with the AeroLeaf platform:

- [Installation Guide](./docs/INSTALLATION.md) - Detailed setup instructions
- [User Guide](./docs/USER_GUIDE.md) - How to use the application
- [Developer Guide](./docs/DEVELOPER_GUIDE.md) - Development workflow and guidelines
- [API Documentation](./docs/API.md) - API endpoints and usage
- [Blockchain Integration](./docs/BLOCKCHAIN.md) - Smart contract details
- [ML Processing](./docs/ML_PROCESSING.md) - Machine learning components
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues and solutions

## 🤝 Contributing

We welcome contributions to Project AeroLeaf! Please see our [Contributing Guidelines](./docs/CONTRIBUTING.md) for more information.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please contact:

- **Project Lead**: John Smith - john.smith@aeroleaf.com
- **Technical Support**: support@aeroleaf.com
- **Website**: [www.aeroleaf.com](https://www.aeroleaf.com)
- **GitHub**: [github.com/aeroleaf](https://github.com/aeroleaf)
