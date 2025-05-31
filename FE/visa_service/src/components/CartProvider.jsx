import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../store/cartSlice";

// This component doesn't render anything, it just fetches the cart on mount
const CartProvider = () => {
  const dispatch = useDispatch();
  const { isOnline } = useSelector((state) => state.cart);

  // Fetch cart when component mounts
  useEffect(() => {
    if (isOnline) {
      dispatch(fetchCart());
    }
  }, [dispatch, isOnline]);

  return null;
};

export default CartProvider;
