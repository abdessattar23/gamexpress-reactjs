import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  Card,
  Divider,
  Rating,
} from "@mui/material";
import {
  ShoppingCart,
  ArrowBack,
  LocalShipping,
  Storefront,
  Security,
  Info,
} from "@mui/icons-material";
import api from "../../api/axios";

const API_BASE_URL = "http://localhost:8000";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);

        if (response.data.category_id) {
          try {
            const categoryResponse = await api.get(
              `/v1/admin/categories/${response.data.category_id}`
            );
            setCategory(categoryResponse.data.data);
          } catch (categoryErr) {
            console.error("Error fetching category:", categoryErr);
          }
        }

        if (response.data.images && response.data.images.length > 0) {
          const imageUrl = response.data.images[0].image_url;
          setSelectedImage(
            imageUrl.startsWith("http")
              ? imageUrl
              : `${API_BASE_URL}/${imageUrl}`
          );
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Unable to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button component={Link} to="/" startIcon={<ArrowBack />}>
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Product not found
          </Typography>
          <Button component={Link} to="/" startIcon={<ArrowBack />}>
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  const features = [
    {
      icon: <LocalShipping />,
      title: "Fast Delivery",
      description: "Free shipping on orders over €50",
    },
    {
      icon: <Storefront />,
      title: "In Stock",
      description: "Available for immediate shipping",
    },
    {
      icon: <Security />,
      title: "Secure Payment",
      description: "Your transaction is protected",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/products"
        startIcon={<ArrowBack />}
        sx={{
          mb: 4,
          color: "text.primary",
          "&:hover": {
            color: "primary.main",
            backgroundColor: "transparent",
          },
        }}
      >
        Back to Products
      </Button>

      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: 2,
                  bgcolor: "grey.50",
                }}
              >
                <Box
                  component="img"
                  src={selectedImage || "/placeholder-image.jpg"}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: 400,
                    objectFit: "contain",
                    mb: 2,
                    borderRadius: 1,
                  }}
                />
                {product.images && product.images.length > 0 && (
                  <ImageList
                    sx={{
                      width: "100%",
                      maxHeight: 100,
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(80px, 1fr))!important",
                      gap: "8px!important",
                    }}
                  >
                    {product.images.map((image, index) => (
                      <ImageListItem
                        key={index}
                        onClick={() =>
                          setSelectedImage(
                            image.image_url.startsWith("http")
                              ? image.image_url
                              : `${API_BASE_URL}/storage/${image.image_url}`
                          )
                        }
                        sx={{
                          cursor: "pointer",
                          border:
                            selectedImage ===
                            (image.image_url.startsWith("http")
                              ? image.image_url
                              : `${API_BASE_URL}/storage/${image.image_url}`)
                              ? 2
                              : 1,
                          borderColor:
                            selectedImage ===
                            (image.image_url.startsWith("http")
                              ? image.image_url
                              : `${API_BASE_URL}/storage/${image.image_url}`)
                              ? "primary.main"
                              : "divider",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={
                            image.image_url.startsWith("http")
                              ? image.image_url
                              : `${API_BASE_URL}/storage/${image.image_url}`
                          }
                          alt={`${product.name} - ${index}`}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Paper>
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                {product.name}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}
              >
                <Rating value={4.5} readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary">
                  (24 reviews)
                </Typography>
              </Box>

              <Typography
                variant="h4"
                color="primary"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                }}
              >
                {formatCurrency(product.price)}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Chip
                  label={
                    product.status === "available" ? "In Stock" : "Out of Stock"
                  }
                  color={product.status === "available" ? "success" : "error"}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`${product.stock} units available`}
                  variant="outlined"
                  color="primary"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Category
                </Typography>
                <Typography variant="body1">
                  {category ? category.name : "Uncategorized"}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                disabled={product.status !== "available"}
                fullWidth
                sx={{
                  py: 1.5,
                  mb: 3,
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Add to Cart
              </Button>

              <Grid container spacing={2}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ color: "primary.main", mb: 1 }}>
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default ProductDetail;
