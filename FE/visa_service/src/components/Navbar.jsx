import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, isOnline } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const totalItems =
    items && items.length > 0
      ? items.reduce((total, item) => total + (item.quantity || 1), 0)
      : 0;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reduced height from h-16 lg:h-20 to h-14 lg:h-16 */}
        <div className="flex justify-between items-center h-14 lg:h-16">
          {/* Logo - Fixed the color issue */}
          <Link
            to="/"
            className={`text-lg lg:text-xl font-bold transition-all duration-300 hover:scale-105`}
          >
            {isScrolled ? (
              // When scrolled, show gradient text for both parts
              <>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Shop
                </span>
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Hub
                </span>
              </>
            ) : (
              // When not scrolled, show white text
              <>
                <span className="text-white">Shop</span>
                <span className="text-white">Hub</span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isOnline && (
              <div className="animate-pulse">
                <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full font-medium">
                  Offline Mode
                </span>
              </div>
            )}

            {/* Cart Button - Reduced padding */}
            <button
              onClick={() => navigate("/cart")}
              className={`group relative flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 ${
                isScrolled
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
              }`}
            >
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 py-0.5 min-w-[1rem] h-4 flex items-center justify-center animate-bounce">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">Cart</span>
            </button>

            {/* User Menu - Reduced padding and size */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`group flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                  }`}
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl py-1.5 z-50 border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg
                        className="w-3.5 h-3.5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg
                        className="w-3.5 h-3.5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      My Orders
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <svg
                        className="w-3.5 h-3.5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button - Smaller size */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-1.5 rounded-lg transition-colors duration-200 ${
              isScrolled
                ? "text-gray-800 hover:bg-gray-100"
                : "text-white hover:bg-white/20"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-3">
              {!isOnline && (
                <div className="text-center">
                  <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full font-medium">
                    Offline Mode
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  navigate("/cart");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  <span className="font-medium text-gray-800">Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-2.5 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="font-medium text-gray-800">
                      {user?.name || "User"}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    className="block w-full p-2.5 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block w-full p-2.5 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full p-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block w-full p-2.5 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full p-2.5 text-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
