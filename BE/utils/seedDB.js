const Product = require("../models/Product");

// Generate 100 products across 20 categories (5 products per category)
const generateProducts = () => {
  const categories = [
    "Tourist Visa",
    "Business Visa",
    "Student Visa",
    "Work Visa",
    "Family Visa",
    "Transit Visa",
    "Medical Visa",
    "Diplomatic Visa",
    "Journalist Visa",
    "Religious Visa",
    "Investor Visa",
    "Retirement Visa",
    "Digital Nomad Visa",
    "Entrepreneur Visa",
    "Refugee Visa",
    "Asylum Visa",
    "Residence Permit",
    "Citizenship",
    "Visa Extension",
    "Visa Translation",
  ];

  const countries = [
    "USA",
    "UK",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "China",
    "India",
    "Brazil",
    "South Africa",
    "Russia",
    "Mexico",
    "Spain",
    "Italy",
    "Netherlands",
    "Sweden",
    "Singapore",
    "UAE",
    "New Zealand",
  ];

  const variants = ["Standard", "Express", "Premium", "VIP", "Budget"];

  const products = [];

  // For each category, create 5 products
  categories.forEach((category) => {
    for (let i = 0; i < 5; i++) {
      const country = countries[Math.floor(Math.random() * countries.length)];
      const variant = variants[Math.floor(Math.random() * variants.length)];
      const basePrice = 50 + Math.floor(Math.random() * 450); // Random price between 50 and 500

      products.push({
        name: `${category} - ${country}`,
        price: basePrice,
        category: category,
        variant: variant,
        image: `https://via.placeholder.com/150?text=${category.replace(
          /\s+/g,
          "+"
        )}`,
        description: `${variant} ${category.toLowerCase()} processing for ${country}`,
        quantity: 50 + Math.floor(Math.random() * 150), // Random quantity between 50 and 200
      });
    }
  });

  return products;
};

// Generate the products
const products = generateProducts();

/**
 * Seeds the database with initial products if the products collection is empty
 */
const seedIfEmpty = async () => {
  try {
    // Check if products collection is empty
    const count = await Product.countDocuments();

    if (count === 0) {
      console.log("Products collection is empty. Seeding database...");

      // Insert products
      await Product.insertMany(products);
      console.log("Database seeded successfully with initial products");
    } else {
      console.log(
        `Database already contains ${count} products. Skipping seed.`
      );
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

/**
 * Resets the database by deleting all products and re-seeding
 */
const resetDatabase = async () => {
  try {
    console.log("Resetting database...");

    // Delete all existing products
    await Product.deleteMany({});
    console.log("All products deleted");

    // Insert new products
    await Product.insertMany(products);
    console.log(
      "Database re-seeded successfully with 100 products across 20 categories"
    );

    return {
      success: true,
      message: "Database reset successful",
      count: products.length,
    };
  } catch (error) {
    console.error("Error resetting database:", error);
    return {
      success: false,
      message: "Database reset failed",
      error: error.message,
    };
  }
};

module.exports = { seedIfEmpty, resetDatabase, products };
