import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Chip,
  Box,
  IconButton,
  TextField
} from '@mui/material';
import { Add, Remove, AddShoppingCart } from '@mui/icons-material';

const ProductCard = ({ 
  product, 
  onAddToCart 
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(product.stock, Number(e.target.value)));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={product.images?.find(img => img.is_primary)?.image_url || '/placeholder.jpg'}
        alt={product.name}
        sx={{ objectFit: 'contain', p: 2, bgcolor: '#f5f5f5' }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        
        <Chip 
          label={product.status} 
          size="small" 
          color={product.status === 'available' ? 'success' : 'error'} 
          sx={{ mb: 1 }}
        />
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.stock} in stock
        </Typography>
        
        <Typography variant="h6" color="primary">
          ${(product.price * quantity).toFixed(2)}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            size="small" 
            onClick={handleDecrease}
            disabled={quantity <= 1}
          >
            <Remove />
          </IconButton>
          <TextField
            size="small"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ 
              min: 1,
              max: product.stock,
              style: { 
                textAlign: 'center',
                width: 40
              }
            }}
            sx={{ mx: 1 }}
          />
          <IconButton 
            size="small" 
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
          >
            <Add />
          </IconButton>
        </Box>

        <Button
          size="small"
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.status !== 'available'}
        >
          Add
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;