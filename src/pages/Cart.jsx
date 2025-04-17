import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Alert,
  Paper,
  TextField,
  Snackbar,
} from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  ShoppingCartCheckout,
  ArrowBack,
  Refresh,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

const API_BASE_URL = "http://localhost:8000";

const Cart = () => {
  const { cart, loading, error, fetchCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    const initialQuantities = {};
    if (Array.isArray(cart)) {
      cart.forEach((item) => {
        if (item && item.id) {
          initialQuantities[item.id] = item.quantity || 1;
        }
      });
    }
    setQuantities(initialQuantities);
  }, [cart]);

  const showNotification = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantities({
      ...quantities,
      [itemId]: newQuantity,
    });
  };


  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setLocalLoading(true);
    try {
      const result = await updateQuantity(itemId, newQuantity);
      showNotification(result.message);
    } catch (err) {
      showNotification("Error updating quantity");
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };


  const handleRemoveItem = async (itemId) => {
    setLocalLoading(true);
    try {
      const result = await removeFromCart(itemId);
      showNotification(result.message);
    } catch (err) {
      showNotification("Error removing item");
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };


  const handleRefreshCart = async () => {
    setLocalLoading(true);
    try {
      await fetchCart();
      showNotification("Cart refreshed");
    } catch (err) {
      showNotification("Error refreshing cart");
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };


  const handleClearCart = async () => {
    setLocalLoading(true);
    try {
      const result = await clearCart();
      showNotification(result.message);
    } catch (err) {
      showNotification("Error clearing cart");
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };


  const calculateTotal = () => {
    if (!Array.isArray(cart)) return 0;
    
    return cart.reduce((sum, item) => {
      if (!item || !item.product || !item.product.price) return sum;
      const quantity = quantities[item.id] || item.quantity || 1;
      return sum + (parseFloat(item.product.price) * quantity);
    }, 0);
  };


  const formatCurrency = (amount) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  if (loading || localLoading) return <Loader />;


  const validCart = Array.isArray(cart) ? cart : [];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Shopping Cart
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button 
          startIcon={<Delete />} 
          onClick={handleClearCart}
          variant="outlined"
          color="error"
          size="small"
          disabled={validCart.length === 0}
        >
          Clear Cart
        </Button>
        
        <Button 
          startIcon={<Refresh />} 
          onClick={handleRefreshCart}
          variant="outlined"
          size="small"
        >
          Refresh Cart
        </Button>
      </Box>

      {!error && validCart.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center", mt: 4, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Looks like you haven't added anything to your cart yet.
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{ mt: 2, textTransform: "none", px: 4 }}
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Paper>
      )}

      {!error && validCart.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h5" fontWeight={600}>
                  Cart Items ({validCart.length})
                </Typography>
                <Button
                  component={Link}
                  to="/"
                  startIcon={<ArrowBack />}
                  variant="text"
                  sx={{ textTransform: "none" }}
                >
                  Continue Shopping
                </Button>
              </Box>

              <List disablePadding>
                {validCart.map((item, idx) => {
                  if (!item || !item.product) return null;
                  
                  return (
                    <React.Fragment key={item.id || idx}>
                      <ListItem sx={{ py: 2, px: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            src={
                              item.product.images && item.product.images.length > 0
                                ? item.product.images[0].image_url?.startsWith("http")
                                  ? item.product.images[0].image_url
                                  : `${API_BASE_URL}/storage/${item.product.images[0].image_url}`
                                : "/placeholder-image.jpg"
                            }
                            alt={item.product.name || "Product"}
                            sx={{ width: 80, height: 80, borderRadius: 2 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          sx={{ ml: 2 }}
                          primary={
                            <Typography
                              variant="subtitle1"
                              fontWeight={500}
                              component={Link}
                              to={`/product/${item.product.id}`}
                              sx={{ 
                                textDecoration: "none", 
                                color: "text.primary",
                                "&:hover": { color: "primary.main" }
                              }}
                            >
                              {item.product.name || "Unnamed Product"}
                            </Typography>
                          }
                          secondary={
                            <Typography color="primary.main" fontWeight={500} sx={{ mt: 1 }}>
                              {formatCurrency(item.product.price || 0)} each
                            </Typography>
                          }
                        />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, quantities[item.id] - 1)}
                            disabled={quantities[item.id] <= 1}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            size="small"
                            value={quantities[item.id] || 1}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                handleQuantityChange(item.id, value);
                              }
                            }}
                            inputProps={{ 
                              min: 1, 
                              style: { textAlign: "center", width: "30px" } 
                            }}
                            variant="outlined"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleUpdateQuantity(item.id, quantities[item.id] || 1)}
                            sx={{ ml: 1, fontSize: "0.7rem" }}
                          >
                            Update
                          </Button>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", ml: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {formatCurrency((item.product.price || 0) * (quantities[item.id] || 1))}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(item.id)}
                            sx={{ mt: 1 }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItem>
                      {idx < validCart.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">
                    {formatCurrency(calculateTotal())}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Shipping</Typography>
                  <Typography variant="body1">
                    {formatCurrency(0)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Tax</Typography>
                  <Typography variant="body1">
                    {formatCurrency(0)}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  {formatCurrency(calculateTotal())}
                </Typography>
              </Box>
              
              <Button
                component={Link}
                to="/checkout"
                variant="contained"
                fullWidth
                startIcon={<ShoppingCartCheckout />}
                disabled={validCart.length === 0 || loading || !!error}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Notification snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Cart; 