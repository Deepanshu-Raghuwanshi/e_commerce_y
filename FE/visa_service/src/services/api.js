// Mock API service for handling product data and orders

// Get all products
export const getProducts = async () => {
  // In a real application, this would be an API call
  // For now, we'll import the mock data directly in the components
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Products fetched successfully" });
    }, 500);
  });
};

// Submit order
export const submitOrder = async (orderData) => {
  // In a real application, this would send the order to a backend API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Order placed successfully",
        orderId: "ORD-" + Math.floor(Math.random() * 1000000),
        orderData,
      });
    }, 1000);
  });
};

// Sample API response structure for products
/*
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Visa Application Review",
      "description": "Expert review of your visa application to ensure accuracy and completeness.",
      "price": 99.99,
      "category": "Visa Consultation"
    },
    {
      "id": 2,
      "name": "Document Verification",
      "description": "Thorough verification of all your supporting documents for visa application.",
      "price": 79.99,
      "category": "Documentation Support"
    }
  ]
}
*/

// Sample API request for order submission
/*
{
  "items": [
    {
      "id": 1,
      "name": "Visa Application Review",
      "price": 99.99,
      "category": "Visa Consultation",
      "quantity": 1
    },
    {
      "id": 2,
      "name": "Document Verification",
      "price": 79.99,
      "category": "Documentation Support",
      "quantity": 2
    }
  ],
  "subtotal": 259.97,
  "discountRate": 0.1,
  "discountAmount": 25.997,
  "totalAmount": 233.973,
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
*/

// Sample API response for order submission
/*
{
  "success": true,
  "message": "Order placed successfully",
  "orderId": "ORD-123456",
  "orderDetails": {
    "items": [...],
    "subtotal": 259.97,
    "discountRate": 0.1,
    "discountAmount": 25.997,
    "totalAmount": 233.973
  }
}
*/
