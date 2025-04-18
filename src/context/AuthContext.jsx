import { createContext, useContext, useState, useEffect } from "react";
import api, { getCsrfCookie } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          const { data } = await api.get("/user");
          setUser({
            user: data,
          });
          setIsAuthenticated(true);
          if (localStorage.getItem("cart_session_id")) {
            const { data } = await api.post("/v2/cart/merge", {
              session_id: localStorage.getItem("cart_session_id"),
            });
            console.log("Cart merged:", data);
          }
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      await getCsrfCookie(); // Get CSRF cookie for Laravel Sanctum
      const { data } = await api.post("/login", credentials);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      const userData = { user: data.user };
      console.log(data);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (credentials) => {
    try {
      await getCsrfCookie(); // Get CSRF cookie for Laravel Sanctum
      const { data } = await api.post("/register", credentials);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      const userData = { user: data.user };
      console.log(data);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Register failed:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Register failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      delete api.defaults.headers.common["Authorization"];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
