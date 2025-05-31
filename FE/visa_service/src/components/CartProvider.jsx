import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../store/cartSlice";

// This component doesn't render anything, it just fetches the cart on mount
const CartProvider = () => {
  const dispatch = useDispatch();
  const { isOnline } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Fetch cart when component mounts, but only if user is authenticated
  useEffect(() => {
    if (isOnline && isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isOnline, isAuthenticated]);

  return null;
};

export default CartProvider;
