import { 
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField
} from '@mui/material';
import { Delete, ShoppingCartCheckout } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { 
    cartItems, 
    updateCartItem, 
    removeFromCart, 
    checkout 
  } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.quantity * item.product.price);
    }, 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateCartItem(itemId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button 
          component={Link} 
          to="/products" 
          variant="contained"
        >
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <List>
          {cartItems.map((item) => (
            <div key={item.id}>
              <ListItem
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => removeFromCart(item.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={item.product.name}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        ${item.product.price.toFixed(2)} each
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          inputProps={{ 
                            min: 1,
                            style: { 
                              textAlign: 'center',
                              width: 50
                            }
                          }}
                          sx={{ mx: 1 }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="subtitle1" sx={{ ml: 2 }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Total: ${calculateTotal().toFixed(2)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartCheckout />}
            onClick={checkout}
            sx={{ minWidth: 200 }}
          >
            Checkout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CartPage;