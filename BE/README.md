# ShopHub E-Commerce Backend API

This is the backend API for the ShopHub E-Commerce platform, providing product management, cart functionality, checkout processing, user authentication, and AI-powered customer support.

## Features

- User authentication and authorization (register, login, profile management)
- Product listing and details with category filtering
- Cart management (add, view, update, remove items)
- Checkout process with order creation
- Discount calculation (10% off for bundled products from different categories)
- AI-powered chat support using OpenAI API
- Order history and tracking

## Tech Stack

### Core Technologies

- **Node.js** (v14+) - JavaScript runtime environment
- **Express.js** (v4) - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** (v6+) - MongoDB object modeling for Node.js

### Authentication & Security

- **JSON Web Tokens (JWT)** - For secure authentication
- **bcryptjs** - For password hashing
- **express-validator** - For input validation

### External Integrations

- **Axios** - For HTTP requests to external APIs
- **OpenAI API** - For AI-powered chat functionality

### Development Tools

- **nodemon** - For automatic server restarts during development
- **dotenv** - For environment variable management
- **cors** - For Cross-Origin Resource Sharing

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get authentication token
- `GET /api/users/profile` - Get user profile information
- `PUT /api/users/profile` - Update user profile

### Products

- `GET /api/products` - Get all products (with optional category filtering)
- `GET /api/products/:id` - Get a single product by ID

### Cart

- `GET /api/cart` - Get the current user's cart
- `POST /api/cart` - Add a product to the cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove an item from the cart

### Checkout & Orders

- `POST /api/checkout` - Process checkout and create an order
- `GET /api/orders` - Get user's order history
- `GET /api/orders/:id` - Get details of a specific order

### Chat

- `POST /api/chat` - Proxy endpoint for AI-based chat widget

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (local instance or MongoDB Atlas account)
- OpenAI API key

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/Deepanshu-Raghuwanshi/e_commerce_y.git
   cd e_commerce_y/BE
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root of the BE directory with the following variables:

   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

   Notes:

   - For `MONGO_URI`, you can use a local MongoDB instance or create a free MongoDB Atlas cluster
   - For `JWT_SECRET`, generate a strong random string (at least 32 characters)
   - For `OPENAI_API_KEY`, sign up at OpenAI and get an API key

4. **Database Setup**

   The database will be automatically seeded with initial products on server startup if the products collection is empty.

   **Database Management Commands:**

   - To manually seed the database (only if empty):
     ```bash
     npm run seed
     ```
   - To force re-seed the database (delete existing products and add new ones):
     ```bash
     npm run seed:force
     ```
   - To reset the database (delete all products and add 100 new products across 20 categories):
     ```bash
     npm run reset-db
     ```

5. **Start the server**

   For development (with auto-restart):

   ```bash
   npm run dev
   ```

   For production:

   ```bash
   npm start
   ```

   The server will start on the port specified in your `.env` file (default: 5000).

## Project Structure

```
BE/
├── controllers/           # Request handlers for each route
│   ├── cartController.js  # Cart management logic
│   ├── chatController.js  # AI chat functionality
│   ├── checkoutController.js # Checkout and order processing
│   ├── productController.js # Product listing and details
│   └── userController.js  # User authentication and profile management
├── middleware/            # Custom middleware
│   └── auth.js            # Authentication middleware
├── models/                # Database models
│   ├── Cart.js            # Cart schema
│   ├── Order.js           # Order schema
│   ├── Product.js         # Product schema
│   └── User.js            # User schema
├── routes/                # API routes
│   ├── cartRoutes.js      # Cart endpoints
│   ├── chatRoutes.js      # Chat endpoints
│   ├── checkoutRoutes.js  # Checkout endpoints
│   ├── productRoutes.js   # Product endpoints
│   └── userRoutes.js      # User authentication endpoints
├── utils/                 # Utility functions
│   ├── discountCalculator.js # Discount calculation logic
│   └── seedDB.js          # Database seeding utility
├── .env                   # Environment variables (create this file)
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies and scripts
├── README.md              # Project documentation
├── resetDB.js             # Database reset script
├── seeder.js              # Standalone database seeder
└── server.js              # Main application entry point
```

## Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with nodemon for development
- `npm run seed` - Seed the database with initial products (if empty)
- `npm run seed:force` - Force re-seed the database
- `npm run reset-db` - Reset the database and add 100 new products

## Error Handling

The API uses consistent error handling with appropriate HTTP status codes and error messages. Common status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server-side error

## Authentication Flow

1. User registers with email and password
2. Password is hashed using bcryptjs
3. User logs in and receives a JWT token
4. Token is included in Authorization header for protected routes
5. Token is verified using the JWT_SECRET
