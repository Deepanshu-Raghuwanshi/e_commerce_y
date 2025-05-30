const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { resetDatabase } = require("./utils/seedDB");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/visa_services")
  .then(async () => {
    console.log("MongoDB connected for database reset");

    try {
      // Reset the database
      const result = await resetDatabase();

      if (result.success) {
        console.log(` ${result.message}`);
        console.log(` ${result.count} products added to the database`);
      } else {
        console.error(` ${result.message}`);
        console.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error resetting database:", error);
    } finally {
      // Disconnect from MongoDB
      mongoose.disconnect();
      console.log("MongoDB disconnected");
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
