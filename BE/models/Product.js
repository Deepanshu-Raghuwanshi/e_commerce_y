const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    variant: {
      type: String,
      trim: true,
      default: "Standard",
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop",
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
