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
    const getCartItems = async () => {
      if (isAuthenticated) {
        fetchCart();
      } else {
        if (localStorage.getItem("session_id")) {
          const response = await api.get("/v2/cart/items", {
            params: {
              session_id: localStorage.getItem("session_id"),
            },
          });
          setCart(response.data.cart || []);
        } else {
          setCart([]);
        }
      }
    };

    getCartItems();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/v2/cart/items");
      console.log(response);
      setCart(response.data.cart || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch cart");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // const cartTotal = cart.reduce((total, item) => {
  //   return total + parseFloat(item.product.price) * item.quantity;
  // }, 0);

  // const cartItemCount = cart.reduce((count, item) => {
  //   return count + item.quantity;
  // }, 0);

  const addToCart = async (product, id, quantity) => {
    if (!isAuthenticated) {
      const updatedCart = [...cart, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      if (!localStorage.getItem("session_id")) {
        const response = await api.post("/v2/cart/add", {
          product_id: id,
          quantity: quantity,
        });

        if (response.data.session_id) {
          localStorage.setItem("session_id", response.data.session_id);
        }
      } else {
        const response = await api.post("/v2/cart/add", {
          product_id: id,
          quantity: quantity,
          session_id: localStorage.getItem("session_id"),
        });
      }
      setCart(updatedCart);
      return;
    } else {
      try {
        const response = await api.post("/v2/cart/add", {
          product_id: id,
          quantity: quantity,
        });
        setCart((prevCart) => [...prevCart, response.data.cart]);
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    }
  };

  const value = {
    cart,
    loading,
    error,
    // cartTotal,
    // cartItemCount,
    fetchCart,
    addToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
