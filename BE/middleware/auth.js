const jwt = require("jsonwebtoken");

// Mock authentication middleware
// In a real application, this would verify a JWT token
const auth = (req, res, next) => {
  try {
    // For this assignment, we'll use a mock user ID
    // In a real application, you would extract this from a JWT token
    req.userId = "mock-user-123";
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = auth;
