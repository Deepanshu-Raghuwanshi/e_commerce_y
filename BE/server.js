const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { seedIfEmpty } = require("./utils/seedDB");

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/visa_services")
  .then(() => {
    console.log("Connected to MongoDB");
    // Seed the database if it's empty
    seedIfEmpty();
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/chat", chatRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Visa Services API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
