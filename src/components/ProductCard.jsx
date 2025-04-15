import { Box, Typography, Button, Paper, Chip, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";

const ProductCard = ({ product }) => {
  const defaultImage = "https://placehold.co/300x300/6366f1/fff?text=GameXpress";

  const primaryImage = product.images.find(img => img.is_primary === 1);
  const firstImage = product.images[0];
  const imageUrl = primaryImage?.image_url || firstImage?.image_url;
  
  return (
    <Paper
      elevation={0}
      sx={{
        height: '380px', 
        width: '100%',
        maxWidth: '300px', 
        minWidth: '300px', 
        margin: '0 auto', 
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'background.paper',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          '& .product-image': {
            transform: 'scale(1.05)',
          }
        }
      }}
    >
      {/* Image Container - EXACT fixed height */}
      <Box 
        sx={{ 
          position: 'relative',
          height: '200px', 
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#f0f1f7'
        }}
      >
        <Box
          className="product-image"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${imageUrl ? `http://localhost:8000/storage/${imageUrl}` : defaultImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'transform 0.5s ease',
          }}
        />
        
        {/* Price Tag */}
        <Chip
          label={`$${product.price}`}
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 'bold',
            fontSize: '0.85rem',
            height: '26px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        />
        
        {/* Status Badge - Show only if stock is low */}
        {product.stock <= 10 && (
          <Chip
            label={`Only ${product.stock} left`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontSize: '0.75rem',
              height: '26px'
            }}
          />
        )}
      </Box>
      
      {/* Content - EXACT fixed height */}
      <Box sx={{ 
        p: 2,
        display: 'flex', 
        flexDirection: 'column', 
        height: '160px', 
        justifyContent: 'space-between'
      }}>
        {/* Title section - Fixed height */}
        <Box sx={{ height: '100px' }}>
          <Tooltip title={product.name}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                height: '32px' 
              }}
            >
              {product.name}
            </Typography>
          </Tooltip>
          
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: '0.9rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '3',
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
              height: '68px', 
            }}
          >
            {product.description}
          </Typography>
        </Box>
        
        {/* Action Buttons - Fixed height */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          gap: 1.5, 
          pt: 1.5,
          height: '44px', 
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            component={Link}
            to={`/products/${product.id}`}
            variant="outlined"
            size="medium"
            sx={{
              fontSize: '0.85rem',
              py: 0.75,
              minWidth: 0,
              flex: 1
            }}
          >
            Details
          </Button>
          <Button
            variant="contained"
            size="medium"
            startIcon={<ShoppingCart sx={{ fontSize: '1.1rem' }} />}
            sx={{
              fontSize: '0.85rem',
              py: 0.75,
              flex: 1
            }}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductCard; 