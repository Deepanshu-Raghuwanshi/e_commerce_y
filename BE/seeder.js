const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const { products } = require("./utils/seedDB");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/visa_services")
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Seed function
const seedProducts = async () => {
  try {
    // Check if products collection is empty
    const count = await Product.countDocuments();

    if (count === 0) {
      console.log("Products collection is empty. Seeding database...");

      // Insert products
      await Product.insertMany(products);
      console.log("Products seeded successfully");
    } else {
      console.log(
        `Database already contains ${count} products. Use --force flag to override.`
      );

      // Check if force flag is provided
      if (process.argv.includes("--force")) {
        console.log("Force flag detected. Deleting existing products...");

        // Delete existing products
        await Product.deleteMany({});
        console.log("Products deleted");

        // Insert new products
        await Product.insertMany(products);
        console.log("Products seeded successfully");
      }
    }

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

// Run the seeder
seedProducts();
