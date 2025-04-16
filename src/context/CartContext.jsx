import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/v2/cart/items");
      setCart(response.data.cart || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch cart");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const cartTotal = cart.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);

 
  const cartItemCount = cart.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  const value = {
    cart,
    loading,
    error,
    cartTotal,
    cartItemCount,
    fetchCart
  };

return (
  <CartContext.Provider value={value}>
    {children}
  </CartContext.Provider>
);


};

export default CartContext; 