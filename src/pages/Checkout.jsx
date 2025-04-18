import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Alert,
  Paper,
} from "@mui/material";
import { Edit, ShoppingCartCheckout } from "@mui/icons-material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const API_BASE_URL = "http://localhost:8000";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!isAuthenticated) {
          navigate("/login", { replace: true });
          return;
        }
        const response = await api.get("/v2/cart/items");
        setCartItems(response.data.items);
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Please log in to view your cart."
            : "Failed to load cart items. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const calculateTotal = () =>
    cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const handleProceedToPayment = () => {
    console.log("Proceeding to payment...");
  };

  if (loading) return <Loader />;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          {error.includes("log in") && (
            <Button
              component={Link}
              to="/login"
              size="small"
              sx={{ ml: 2, textTransform: "none" }}
              variant="outlined"
            >
              Login
            </Button>
          )}
        </Alert>
      )}

      {!error && cartItems.length === 0 && (
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

      {!error && cartItems.length > 0 && (
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              flexGrow: 1,
              minWidth: 0,
              "& > .MuiPaper-root": {
                height: "100%",
              },
            }}
          >
            <Paper sx={{ p: 3, borderRadius: 2, mb: { xs: 3, md: 0 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                  pb: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Order Summary
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"} in cart
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to="/cart"
                  startIcon={<Edit />}
                  size="medium"
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                  }}
                >
                  Edit Cart
                </Button>
              </Box>
              <List disablePadding>
                {cartItems.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ py: 2, px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          src={
                            item.product.images[0].image_url?.startsWith("http")
                              ? item.product.images[0].image_url
                              : `${API_BASE_URL}/storage/${item.product.images[0].image_url}`
                          }
                          alt={item.product.name}
                          sx={{ width: 80, height: 80, borderRadius: 2 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        sx={{ ml: 2 }}
                        primary={
                          <Typography variant="subtitle1" fontWeight={500}>
                            {item.product.name}
                          </Typography>
                        }
                        secondary={
                          <Box component="div">
                            <Box component="div" sx={{ mt: 1 }}>
                              Quantity: {item.quantity}
                            </Box>
                            <Box
                              component="div"
                              color="primary.main"
                              fontWeight={500}
                            >
                              {formatCurrency(item.product.price)} each
                            </Box>
                          </Box>
                        }
                      />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {formatCurrency(item.product.price * item.quantity)}
                      </Typography>
                    </ListItem>
                    {idx < cartItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            md={5}
            sx={{
              flexShrink: 0,
              width: { md: "380px" },
            }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                position: "sticky",
                top: 20,
                maxWidth: { xs: "100%", md: "380px" },
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight={500}>
                    {formatCurrency(calculateTotal())}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography fontWeight={500} color="success.main">
                    Free
                  </Typography>
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
              </Box>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCartCheckout />}
                onClick={handleProceedToPayment}
                disabled={cartItems.length === 0 || loading || !!error}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Proceed to Payment
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Checkout;
