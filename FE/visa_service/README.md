# ShopHub E-Commerce Platform - Frontend

A modern React application for an e-commerce platform featuring a wide range of products including watches, toys, sports equipment, dresses, jewelry, and more with cart functionality, checkout process, user authentication, and AI-powered customer support.

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

### Frontend Core

- **React** (v18) - UI library
- **Redux Toolkit** - State management
- **React Router** (v6) - Routing and navigation
- **Axios** - API requests
- **Tailwind CSS** (v3) - Utility-first CSS framework
- **Vite** (v4) - Build tool and development server

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **JavaScript** - Programming language

## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm (v8 or later) or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Deepanshu-Raghuwanshi/e_commerce_y.git
   cd e_commerce_y/FE/visa_service
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root of the visa_service directory with the following variables:

   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

   Note: For production, use your deployed backend URL

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

This will start the development server at `http://localhost:5173`.

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

### Linting

```bash
npm run lint
# or
yarn lint
```

## Project Structure

```
visa_service/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   │   ├── CartDrawer.jsx       # Cart sidebar component
│   │   ├── CartProvider.jsx     # Cart context provider
│   │   ├── CategoryProducts.jsx # Category product listing
│   │   ├── ChatWidget.jsx       # AI chat widget
│   │   ├── CouponSection.jsx    # Coupon application component
│   │   ├── ErrorBoundary.jsx    # Error handling component
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── ProductCard.jsx      # Product display card
│   │   ├── ProductCarousel.jsx  # Product carousel
│   │   ├── ProtectedRoute.jsx   # Auth protection for routes
│   │   ├── Toast.jsx            # Notification component
│   │   └── ToastContainer.jsx   # Toast notification manager
│   ├── hooks/           # Custom React hooks
│   │   └── useApi.js    # API request hook
│   ├── pages/           # Page components
│   │   ├── CartPage.jsx         # Shopping cart page
│   │   ├── CheckoutPage.jsx     # Checkout process page
│   │   ├── HomePage.jsx         # Main landing page
│   │   ├── LoginPage.jsx        # User login page
│   │   ├── OrderDetailPage.jsx  # Order details page
│   │   ├── OrderHistoryPage.jsx # Order history page
│   │   ├── ProfilePage.jsx      # User profile page
│   │   └── RegisterPage.jsx     # User registration page
│   ├── services/        # API services
│   │   ├── api.js       # API configuration
│   │   └── apiService.js # API request methods
│   ├── store/           # Redux store
│   │   ├── authSlice.js         # Authentication state
│   │   ├── cartSlice.js         # Cart state
│   │   ├── chatSlice.js         # Chat widget state
│   │   ├── checkoutSlice.js     # Checkout process state
│   │   ├── index.js             # Store configuration
│   │   ├── productSlice.js      # Product state
│   │   └── toastSlice.js        # Notification state
│   ├── utils/           # Utility functions
│   │   └── errorHandler.js      # Error handling utility
│   ├── App.jsx          # Main App component
│   ├── App.css          # App-specific styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── .env                 # Environment variables
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── postcss.config.cjs   # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

## Features Implementation

### Product Listing

- Displays products with name, price, image, and category
- Allows filtering by category with an intuitive interface
- Responsive grid layout that adapts to different screen sizes
- "Add to Cart" button for each product with quantity selection
- Product details view with comprehensive information

### Cart

- Shows list of added products with name, price, image, and quantity
- Allows removing items or adjusting quantity with intuitive controls
- Displays subtotal, discount (if applicable), and total price
- Shows applied bundle discount (10% when products from different categories are added)
- Persistent cart using localStorage and backend synchronization
- Cart drawer accessible from any page

### Checkout

- Multi-step checkout process with progress indicator
- Address information collection with validation
- Payment method selection (simulation)
- Order summary with itemized list and pricing breakdown
- Order confirmation with order ID and tracking information
- Integration with backend for order processing and storage

### User Authentication

- Login with email and password
- New user registration with validation
- Secure authentication using JWT tokens
- Protected routes for authenticated users only
- Profile management with personal information
- Password update functionality

### Order Management

- Order history listing with basic order information
- Detailed order view with items, pricing, and status
- Order tracking information (simulated)

### Chat Widget

- AI-based chat widget to answer product-related questions
- Located at the bottom-right corner of the site
- Expandable/collapsible interface
- Integration with OpenAI API for intelligent responses
- Conversation history maintained during session

## State Management

- Redux Toolkit for global state management
  - Authentication state (user info, login status)
  - Cart state (items, quantities, totals)
  - Product state (listings, categories, filters)
  - UI state (loading indicators, notifications)
- Local component state for UI-specific state
- Persistent state with localStorage for cart and user preferences

## API Integration

- RESTful API calls to backend services
- Axios for HTTP requests with interceptors for auth tokens
- Error handling with appropriate user feedback
- Loading states with visual indicators
- Offline mode support with request queuing

## Responsive Design

- Mobile-first approach using Tailwind CSS
- Responsive layouts that adapt to phones, tablets, and desktops
- Custom breakpoints for optimal viewing experience
- Touch-friendly controls for mobile users
- Optimized navigation for different screen sizes

## Performance Optimization

- Code splitting with dynamic imports for route-based chunking
- Lazy loading of images and components
- Memoization of expensive calculations
- Optimized rendering with React.memo and useCallback
- Efficient state updates with Redux Toolkit

## Error Handling

- Global error boundary to catch and display errors
- Form validation with user-friendly error messages
- API error handling with appropriate user feedback
- Fallback UI for failed component rendering
- Console logging for development debugging

## Browser Compatibility

- Support for modern browsers (Chrome, Firefox, Safari, Edge)
- Polyfills for older browsers where necessary
- Graceful degradation for unsupported features

## Local Storage Usage

- Cart data persistence across page refreshes
- User preferences and settings
- Authentication tokens for session management
- Recently viewed products
- Form data recovery
