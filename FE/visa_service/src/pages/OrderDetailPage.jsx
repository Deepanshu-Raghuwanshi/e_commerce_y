import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById } from "../store/checkoutSlice";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedOrder, loading, error } = useSelector(
    (state) => state.checkout
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Fetch order details when component mounts
  useEffect(() => {
    if (isAuthenticated && orderId) {
      dispatch(getOrderById(orderId));
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  }, [dispatch, orderId, isAuthenticated, navigate]);

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>
              {typeof error === "object" && error.message
                ? error.message
                : error}
            </p>
          </div>
          <div className="text-center">
            <Link
              to="/orders"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Order not found.</p>
          <Link
            to="/orders"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
          <Link
            to="/orders"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  Order #{selectedOrder._id}
                </h2>
                <p className="text-sm text-gray-600">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Items</h3>
            <div className="divide-y">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="py-3 flex justify-between">
                  <div className="flex items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Category: {item.category}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${selectedOrder.totalPrice.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Discount:</span>
                  <span>-${selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>
                  $
                  {(
                    selectedOrder.totalPrice - (selectedOrder.discount || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {selectedOrder.status === "pending" && (
          <div className="text-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
