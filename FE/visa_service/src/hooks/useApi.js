import { useState, useCallback } from "react";
import { handleApiError } from "../utils/errorHandler";

/**
 * Custom hook for making API requests with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} Object containing loading state, error state, data, and execute function
 */
const useApi = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (error) {
        const formattedError = error.isApiError ? error : handleApiError(error);
        setError(formattedError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
};

export default useApi;
