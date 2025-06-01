# ShopHub E-Commerce Platform

ShopHub is a full-stack e-commerce application featuring a wide range of products with cart functionality, checkout process, user authentication, and AI-powered customer support.

## Project Overview

This project consists of two main parts:

1. **Frontend**: A React application built with Redux Toolkit, React Router, and Tailwind CSS
2. **Backend**: A Node.js API built with Express.js and MongoDB

## Features

- User authentication (login, registration, profile management)
- Product browsing with category filtering
- Cart functionality with quantity adjustment
- Bundle discount (10% off when purchasing products from different categories)
- Checkout process with order creation
- Order history and tracking
- AI-powered chat widget for customer support
- Responsive design for all device sizes
- Offline mode support with localStorage persistence

## Tech Stack

### Frontend

- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing and navigation
- **Axios** - API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and development server

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JSON Web Tokens (JWT)** - For secure authentication
- **OpenAI API** - For AI-powered chat functionality

## Project Structure

```
e_commerce_y_axis/
├── BE/                  # Backend application
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── .env             # Environment variables (create this file)
│   ├── package.json     # Backend dependencies
│   ├── README.md        # Backend documentation
│   └── server.js        # Main backend entry point
│
└── FE/                  # Frontend application
    └── visa_service/    # React application
        ├── public/      # Static assets
        ├── src/         # Source code
        │   ├── assets/  # Images, fonts, etc.
        │   ├── components/ # UI components
        │   ├── hooks/   # Custom React hooks
        │   ├── pages/   # Page components
        │   ├── services/ # API services
        │   ├── store/   # Redux store
        │   └── utils/   # Utility functions
        ├── .env         # Environment variables (create this file)
        ├── package.json # Frontend dependencies
        └── README.md    # Frontend documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or yarn
- MongoDB (local instance or MongoDB Atlas account)
- OpenAI API key

### Installation and Setup

Clone repo - git clone https://github.com/Deepanshu-Raghuwanshi/e_commerce_y.git

#### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd e_commerce_y/BE
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the BE directory with the following variables:

   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will start on port 5000 by default.

#### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd e_commerce_y/FE/visa_service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the visa_service directory with the following variables:

   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173.

## Database Seeding

The backend includes scripts to seed the database with sample products:

DB will be seeded automatically when running the backend server if DB is empty. If you want to manually seed the database, use the following commands:

```bash
# Seed the database (only if empty)
npm run seed

# Reset the database and add 100 new products
npm run reset-db
```

## Detailed Documentation

For more detailed information about each part of the application:

- [Backend Documentation](./BE/README.md)
- [Frontend Documentation](./FE/visa_service/README.md)
