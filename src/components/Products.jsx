import { useState } from "react";
import { 
  Box, 
  Grid, 
  Typography, 
  Container, 
  CircularProgress, 
  Alert,
  Pagination,
  TextField,
  InputAdornment
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useProducts } from "../context/ProductContext";
import ProductCard from "./ProductCard";

const Products = () => {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // 12 products per page

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 700,
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '60%',
              height: '4px',
              bottom: '-8px',
              left: '0',
              backgroundColor: 'primary.main',
              borderRadius: '2px'
            }
          }}
        >
          Our Games Collection
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search games..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {currentProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">No games found matching your search.</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ px: 2 }}>
            <Grid 
              container 
              spacing={4} 
              sx={{ 
                justifyContent: 'center',
                mx: 'auto'
              }}
            >
              {currentProducts.map((product) => (
                <Grid 
                  item 
                  key={product.id} 
                  sx={{ 
                    width: '300px', // Exact width
                    height: '360px', // Exact height
                    px: 0,
                    mb: 2
                  }}
                >
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={pageCount} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Products; 