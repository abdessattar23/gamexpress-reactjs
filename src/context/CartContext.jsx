import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const GUEST_CART_KEY = "guest_cart";
const SESSION_ID_KEY = "cart_session_id";

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(GUEST_CART_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Error loading cart from localStorage:", e);
      return [];
    }
  });

  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem(SESSION_ID_KEY) || null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
  }, [sessionId]);

  // useEffect(() => {
  //   try {
  //     localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  //   } catch (e) {
  //     console.error("Error saving cart to localStorage:", e);
  //   }
  // }, [cart]);

  useEffect(() => {
    fetchCart();
  }, []);

  const cartTotal = Array.isArray(cart)
    ? cart.reduce((total, item) => {
        if (!item || !item.product || !item.product.price) return total;
        return total + parseFloat(item.product.price) * (item.quantity || 1);
      }, 0)
    : 0;

  const cartItemCount = Array.isArray(cart)
    ? cart.reduce((count, item) => {
        if (!item) return count;
        return count + (item.quantity || 1);
      }, 0)
    : 0;

  const fetchCart = async () => {
    try {
      setLoading(true);

      let response;
      if (isAuthenticated) {
        response = await api.get("/v2/cart/items");
      } else if (sessionId) {
        response = await api.get("/v2/cart/items", {
          params: { session_id: sessionId },
        });
      } else {
        setCart([]);
        setLoading(false);
        return;
      }

      if (response.data && response.data.items) {
        setCart(response.data.items);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        product_id: productId,
        quantity: quantity,
      };

      if (!isAuthenticated && sessionId) {
        payload.session_id = sessionId;
      }

      const response = await api.post("/v2/cart/add", payload);

      if (!isAuthenticated && response.data && response.data.session_id) {
        setSessionId(response.data.session_id);
      }

      await fetchCart();

      return { success: true, message: "Product added to cart" };
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err.response?.data?.message || "Failed to add item to cart");
      return {
        success: false,
        message: err.response?.data?.message || "Failed to add item to cart",
      };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1)
      return { success: false, message: "Quantity must be at least 1" };

    try {
      setLoading(true);
      setError(null);

      const item = cart.find((item) => item.id === itemId);
      if (!item) {
        throw new Error("Item not found in cart");
      }

      const payload = {
        product_id: item.product_id,
        quantity: quantity,
      };

      if (!isAuthenticated && sessionId) {
        payload.session_id = sessionId;
      }

      await api.post(`/v2/cart/update`, payload);

      await fetchCart();

      return { success: true, message: "Quantity updated successfully" };
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError(err.response?.data?.message || "Failed to update quantity");
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update quantity",
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      setError(null);

      await api.delete(`/v2/cart/remove/${itemId}`);

      await fetchCart();

      return { success: true, message: "Item removed from cart" };
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setError(
        err.response?.data?.message || "Failed to remove item from cart"
      );
      return {
        success: false,
        message:
          err.response?.data?.message || "Failed to remove item from cart",
      };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = {};
      if (!isAuthenticated && sessionId) {
        payload.session_id = sessionId;
      }

      await api.post("/v2/cart/clear", payload);

      setCart([]);

      return { success: true, message: "Cart cleared successfully" };
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(err.response?.data?.message || "Failed to clear cart");
      return {
        success: false,
        message: err.response?.data?.message || "Failed to clear cart",
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    error,
    cartTotal,
    cartItemCount,
    sessionId,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
