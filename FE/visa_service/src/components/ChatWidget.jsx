import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage, addUserMessage } from "../store/chatSlice";

// Fallback AI responses for offline mode
const getAIResponse = (question) => {
  const lowerQuestion = question.toLowerCase();

  // Simple keyword matching for demo purposes
  if (lowerQuestion.includes("discount") || lowerQuestion.includes("bundle")) {
    return "We offer a 10% discount when you purchase products from 2 or more different categories!";
  } else if (
    lowerQuestion.includes("watch") ||
    lowerQuestion.includes("watches")
  ) {
    return "We have a great collection of watches including luxury, sports, and casual styles. Check out our watches category for the latest models!";
  } else if (lowerQuestion.includes("toy") || lowerQuestion.includes("toys")) {
    return "Our toys section features educational toys, action figures, board games, and more for all ages. Perfect for gifts!";
  } else if (
    lowerQuestion.includes("sports") ||
    lowerQuestion.includes("fitness")
  ) {
    return "Explore our sports equipment including fitness gear, outdoor sports items, and athletic accessories for all your sporting needs.";
  } else if (
    lowerQuestion.includes("dress") ||
    lowerQuestion.includes("clothing") ||
    lowerQuestion.includes("fashion")
  ) {
    return "Browse our fashion collection featuring trendy dresses, casual wear, and formal attire for every occasion.";
  } else if (
    lowerQuestion.includes("jewelry") ||
    lowerQuestion.includes("jewellery")
  ) {
    return "Discover our stunning jewelry collection including necklaces, earrings, rings, and bracelets to complement your style.";
  } else if (
    lowerQuestion.includes("payment") ||
    lowerQuestion.includes("pay")
  ) {
    return "We accept all major credit cards, PayPal, and bank transfers for secure payment processing.";
  } else if (
    lowerQuestion.includes("shipping") ||
    lowerQuestion.includes("delivery")
  ) {
    return "We offer free shipping on orders over $50 and express delivery options. Most orders are delivered within 3-5 business days.";
  } else if (
    lowerQuestion.includes("return") ||
    lowerQuestion.includes("refund")
  ) {
    return "We offer hassle-free returns within 30 days of purchase. Items must be in original condition for a full refund.";
  } else if (
    lowerQuestion.includes("contact") ||
    lowerQuestion.includes("support")
  ) {
    return "You can contact our support team at support@shophub.com or call us at 1-800-SHOP-HUB for any assistance.";
  } else {
    return "I'm here to help! Ask me about our products, shipping, returns, or any specific items you're looking for.";
  }
};

const ChatWidget = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  const { isOnline } = useSelector((state) => state.cart);

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message to state
    dispatch(addUserMessage(inputValue));

    if (isOnline) {
      // Use API if online
      dispatch(sendChatMessage(inputValue));
    } else {
      // Use local fallback if offline
      setTimeout(() => {
        const response = getAIResponse(inputValue);
        dispatch({
          type: "chat/sendMessage/fulfilled",
          payload: {
            response: {
              message: response,
              timestamp: new Date().toISOString(),
            },
          },
        });
      }, 500);
    }

    setInputValue("");
  };

  // JotForm chatbot integration - UI commented out, keeping Redux logic intact
  return null;

  /* Original ChatWidget UI - Commented out for JotForm integration
  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div
          className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col overflow-hidden"
          style={{ height: "400px" }}
        >
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="font-medium">ShopHub Assistant</h3>
              {!isOnline && (
                <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                  Offline
                </span>
              )}
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-3 text-sm">
                <p>Sorry, there was an error connecting to our chat service.</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  message.isUser ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.isUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {message.text}
                  {message.timestamp && !message.isUser && (
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-left mb-3">
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about our products..."
                className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                className={`${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-4 py-2 rounded-md transition`}
                disabled={loading || !inputValue.trim()}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}
    </div>
  );
  */
};

export default ChatWidget;
