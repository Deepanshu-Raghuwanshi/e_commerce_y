import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../store/cartSlice";

// This component doesn't render anything, it just fetches the cart on mount
const CartProvider = () => {
  const dispatch = useDispatch();
  const { isOnline, loading, error, items } = useSelector(
    (state) => state.cart
  );

  // Fetch cart when component mounts
  useEffect(() => {
    if (isOnline) {
      dispatch(fetchCart());
    }
  }, [dispatch, isOnline]);

  // Set up a polling mechanism to refresh the cart periodically
  // useEffect(() => {
  //   if (!isOnline) return;

  //   const intervalId = setInterval(() => {
  //     dispatch(fetchCart());
  //   }, 10000); // Refresh every 10 seconds

  //   return () => clearInterval(intervalId);
  // }, [dispatch, isOnline]);

  return null;
};

export default CartProvider;
