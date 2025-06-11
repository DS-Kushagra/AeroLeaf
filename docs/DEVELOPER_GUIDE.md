# AeroLeaf Developer Guide

## Introduction

This guide provides technical information for developers working on the AeroLeaf platform. It covers the architecture, development workflow, coding standards, and integration details for the various components of the system.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Frontend Development](#frontend-development)
- [Backend Development](#backend-development)
- [Blockchain Integration](#blockchain-integration)
- [Machine Learning Components](#machine-learning-components)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing Guidelines](#contributing-guidelines)

## Architecture Overview

AeroLeaf is built using a modern web architecture with the following key components:

1. **Frontend**: React-based single-page application
2. **Backend**: Node.js/Express API server
3. **Database**: Firebase/Firestore for data storage
4. **Blockchain**: Ethereum smart contracts for carbon credit tokens
5. **Machine Learning**: Python-based satellite imagery analysis

### System Diagram

```
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|    Frontend    |<--->|    Backend    |<--->|    Database    |
|    (React)     |     |  (Node.js)    |     |  (Firestore)   |
|                |     |                |     |                |
+----------------+     +----------------+     +----------------+
        ^                      ^                      ^
        |                      |                      |
        v                      v                      v
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|   Blockchain   |     |   ML Service   |     |  File Storage  |
|   (Ethereum)   |     |    (Python)    |     |   (Firebase)   |
|                |     |                |     |                |
+----------------+     +----------------+     +----------------+
```

## Development Environment Setup

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Git
- Code editor (VS Code recommended)
- Metamask or similar Ethereum wallet for testing

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/aeroleaf.git
   cd aeroleaf
   ```

2. Install dependencies:
   ```bash
   # Run the setup script
   ./setup.bat
   ```

   Or manually:
   ```bash
   # Backend dependencies
   cd backend
   npm install
   cd ..

   # Frontend dependencies
   cd frontend/aeroleaf-frontend
   npm install
   cd ../..

   # Blockchain dependencies
   cd blockchain
   npm install
   cd ..

   # ML dependencies
   cd ml
   pip install -r requirements.txt
   cd ..
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the root directory
   - Update the values as needed

4. Initialize the database:
   ```bash
   cd backend/services
   node initData.js
   cd ../..
   ```

## Project Structure

```
/aeroleaf
├── backend/                # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── firebase/           # Firebase integration
│   ├── middleware/         # Express middleware
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── server.js           # Entry point
├── blockchain/             # Blockchain components
│   ├── contracts/          # Smart contracts
│   ├── migrations/         # Contract deployment scripts
│   └── test/               # Contract tests
├── docs/                   # Documentation
├── frontend/               # React frontend
│   └── aeroleaf-frontend/
│       ├── public/         # Static assets
│       └── src/            # Source code
│           ├── assets/     # Images, fonts, etc.
│           ├── components/ # React components
│           ├── contexts/   # React contexts
│           ├── pages/      # Page components
│           ├── services/   # API services
│           └── utils/      # Utility functions
├── ml/                     # Machine learning components
│   ├── data/               # Training and test data
│   ├── models/             # Trained models
│   ├── results/            # Analysis results
│   └── scripts/            # Processing scripts
└── scripts/                # Utility scripts
```

## Frontend Development

### Technology Stack

- React (with hooks)
- React Router for navigation
- Material UI for components
- Tailwind CSS for styling
- Framer Motion for animations
- Leaflet for maps
- Three.js for 3D visualizations
- Recharts for data visualization

### Development Workflow

1. Start the development server:
   ```bash
   cd frontend/aeroleaf-frontend
   npm run dev
   ```

2. Access the application at `http://localhost:5173`

### Component Structure

Components are organized as follows:

- **Pages**: Top-level components that correspond to routes
- **Components**: Reusable UI elements
- **Contexts**: State management using React Context API
- **Services**: API communication and data fetching

### Styling Guidelines

- Use Tailwind CSS classes for styling when possible
- Use Material UI's styling system for complex components
- Keep component-specific styles in the same file as the component
- Use CSS variables for theme colors and spacing

## Backend Development

### Technology Stack

- Node.js and Express
- Firebase/Firestore for database
- Firebase Auth for authentication
- Swagger for API documentation

### Development Workflow

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Access the API at `http://localhost:5000/api`
3. Access API documentation at `http://localhost:5000/docs`

### API Structure

The API follows RESTful principles with the following main endpoints:

- `/api/auth` - Authentication endpoints
- `/api/sites` - Reforestation site management
- `/api/credits` - Carbon credit operations
- `/api/verification` - Verification processes
- `/api/users` - User management

### Error Handling

API errors follow a consistent format:

```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Blockchain Integration

### Smart Contracts

The platform uses the following smart contracts:

- `CarbonCredit.sol` - ERC-721 token for carbon credits
- `Marketplace.sol` - Trading functionality
- `Verification.sol` - Verification record storage

### Development Workflow

1. Modify contracts in the `blockchain/contracts` directory
2. Compile contracts:
   ```bash
   cd blockchain
   npx hardhat compile
   ```
3. Test contracts:
   ```bash
   npx hardhat test
   ```
4. Deploy contracts to a local network:
   ```bash
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost
   ```

### Frontend Integration

The frontend interacts with smart contracts using:

- Web3.js for Ethereum interaction
- The Web3Context provider for managing connection state
- Contract ABIs in the `frontend/src/contracts` directory

## Machine Learning Components

### Technology Stack

- Python for data processing
- TensorFlow/PyTorch for models
- GDAL for geospatial data processing
- NumPy, Pandas for data manipulation

### Development Workflow

1. Develop and test ML scripts in the `ml` directory
2. Process satellite imagery using the provided scripts
3. Store results in the `ml/results` directory

### Integration with Backend

The backend calls ML scripts using child processes and reads results from the filesystem or database.

## API Documentation

API documentation is generated using Swagger and is available at `http://localhost:5000/docs` when the backend is running.

To update the documentation:

1. Modify the JSDoc comments in the route files
2. Restart the backend server

## Testing

### Frontend Testing

- Unit tests: `npm test` in the frontend directory
- End-to-end tests: `npm run test:e2e`

### Backend Testing

- Unit tests: `npm test` in the backend directory
- API tests: `npm run test:api`

### Smart Contract Testing

- Run tests: `npx hardhat test` in the blockchain directory

## Deployment

### Production Build

1. Build the frontend:
   ```bash
   cd frontend/aeroleaf-frontend
   npm run build
   ```

2. Prepare the backend for production:
   ```bash
   cd backend
   npm run build
   ```

### Deployment Options

- **Local**: Use the provided scripts for local deployment
- **Cloud**: Deploy to services like Firebase, Heroku, or AWS
- **Blockchain**: Deploy contracts to Ethereum testnets or mainnet

## Contributing Guidelines

### Code Style

- Follow the ESLint configuration for JavaScript/React code
- Use PEP 8 for Python code
- Use Solidity style guide for smart contracts

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

### Commit Message Format

Use conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: feat, fix, docs, style, refactor, test, chore

### Code Review

All code changes require review before merging. Reviewers should check for:

- Functionality
- Code quality
- Test coverage
- Documentation

---

For additional information or questions, please contact the development team or open an issue on GitHub.