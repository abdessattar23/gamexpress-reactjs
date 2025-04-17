import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Badge,
} from "@mui/material";
import { Menu as MenuIcon, ShoppingCart } from "@mui/icons-material";
import { useState } from "react";

const Layout = () => {
  const { isAuthenticated, logout } = useAuth();
  const { cart, cartItemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Only use this if cartItemCount from context is not available
  const fallbackCartItemCount = Array.isArray(cart) ? cart.length : 0;
  
  // Use cartItemCount from context if available, otherwise use fallback
  const displayCartItemCount = typeof cartItemCount === 'number' ? cartItemCount : fallbackCartItemCount;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = isAuthenticated
    ? [
        { text: "Dashboard", path: "/dashboard" },
        { text: "Categories", path: "/categories" },
        { text: "Products", path: "/products" },
      ]
    : [
        { text: "Login", path: "/login" },
        { text: "Register", path: "/register" },
      ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, color: "primary.main" }}>
        GameXpress
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} component={Link} to={item.path}>
            <ListItemText
              primary={item.text}
              sx={{
                color: "text.primary",
                "& span": { fontWeight: 500 },
              }}
            />
          </ListItem>
        ))}
        <ListItem component={Link} to="/cart">
          <ListItemText 
            primary="Cart" 
            sx={{
              color: "text.primary",
              "& span": { fontWeight: 500 },
            }}
          />
          {displayCartItemCount > 0 && (
            <Badge badgeContent={displayCartItemCount} color="primary" sx={{ ml: 1 }} />
          )}
        </ListItem>
        {isAuthenticated && (
          <ListItem button onClick={logout}>
            <ListItemText primary="Logout" sx={{ color: "error.main" }} />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "background.paper",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{ justifyContent: "space-between", px: { xs: 1, sm: 2 } }}
          >
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            >
              GameXpress
            </Typography>

            {isMobile ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  component={Link}
                  to="/cart"
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  <Badge badgeContent={displayCartItemCount} color="primary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: "text.primary",
                      "&:hover": {
                        color: "primary.main",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                <IconButton
                  component={Link}
                  to="/cart"
                  color="primary"
                  sx={{ ml: 1 }}
                >
                  <Badge badgeContent={displayCartItemCount} color="primary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
                {isAuthenticated && (
                  <Button
                    onClick={logout}
                    sx={{
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "error.contrastText",
                      },
                    }}
                  >
                    Logout
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
