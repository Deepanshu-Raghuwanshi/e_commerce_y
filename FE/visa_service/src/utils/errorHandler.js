/**
 * Utility functions for handling API errors
 */

/**
 * Formats error messages from API responses
 * @param {Error} error - The error object from axios
 * @returns {Object} Formatted error object with message and details
 */
export const formatApiError = (error) => {
  // Default error message
  let errorMessage = "An unexpected error occurred";
  let errorDetails = null;

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = error.response;

    if (data && data.message) {
      errorMessage = data.message;
    } else if (status === 404) {
      errorMessage = "Resource not found";
    } else if (status === 401) {
      errorMessage = "Unauthorized access";
    } else if (status === 403) {
      errorMessage = "Forbidden access";
    } else if (status >= 500) {
      errorMessage = "Server error";
    }

    errorDetails = data && data.error ? data.error : null;
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = "No response from server";
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message || "Request configuration error";
  }

  return {
    message: errorMessage,
    details: errorDetails,
    isApiError: true,
  };
};

/**
 * Handles API errors by formatting them and optionally showing a notification
 * @param {Error} error - The error object from axios
 * @param {Function} notifyFn - Optional function to show a notification
 * @returns {Object} Formatted error object
 */
export const handleApiError = (error, notifyFn = null) => {
  const formattedError = formatApiError(error);

  // Log the error to console
  console.error("API Error:", formattedError);

  // Show notification if function is provided
  if (notifyFn && typeof notifyFn === "function") {
    notifyFn(formattedError.message);
  }

  return formattedError;
};

export default {
  formatApiError,
  handleApiError,
};
