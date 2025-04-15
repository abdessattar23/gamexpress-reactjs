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
} from "@mui/icons-material";
import api from "../../api/axios";
import Loader from "../../components/Loader";

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
      setError(null);
      try {
        const response = await api.get(`/products/${id}`);
        const productData = response.data;
        setProduct(productData);

        // Fetch category if category_id exists
        if (productData.category_id) {
          try {
            const categoryResponse = await api.get(
              `/v1/admin/categories/${productData.category_id}`
            );
            setCategory(categoryResponse.data.data);
          } catch (categoryErr) {
            console.error("Error fetching category:", categoryErr);
          }
        }

        // Set initial selected image
        if (productData.images && productData.images.length > 0) {
          const firstImageUrl = productData.images[0].image_url;
          setSelectedImage(
            firstImageUrl.startsWith("http")
              ? firstImageUrl
              : `${API_BASE_URL}/storage/${firstImageUrl}`
          );
        } else {
          setSelectedImage("/placeholder-image.jpg");
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
    return <Loader />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: "center" }}>
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
        <Box sx={{ my: 4, textAlign: "center" }}>
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

  // Process images for consistent display
  const processedImages =
    product.images && product.images.length > 0
      ? product.images.map((image) => ({
          url: image.image_url.startsWith("http")
            ? image.image_url
            : `${API_BASE_URL}/storage/${image.image_url}`,
        }))
      : [{ url: "/placeholder-image.jpg" }];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
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
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Grid container>
          {/* Left Column: Product Images */}
          <Grid
            item
            xs={24}
            md={24}
            sx={{
              borderRight: { md: "1px solid" },
              borderColor: { md: "divider" },
              bgcolor: "grey.50",
              width: "100%",
            }}
          >
            <Box sx={{ p: 3, display: "flex", flexDirection: "column" }}>
              {/* Main Image Display - Fixed height to prevent layout shifts */}
              <Box
                sx={{
                  height: { xs: 350, md: 450 },
                  width: "100%",
                  bgcolor: "white", // Keep background color for empty space
                  borderRadius: 1,
                  mb: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "hidden",
                  backgroundImage: `url(${
                    selectedImage || "/placeholder-image.jpg"
                  })`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* No child img element needed here anymore */}
              </Box>

              {/* Thumbnail Images - Fixed height row */}
              {processedImages.length > 1 && (
                <Box
                  sx={{
                    height: 80,
                    display: "flex",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  <Grid
                    container
                    spacing={1}
                    justifyContent="center"
                    sx={{ maxWidth: 500 }}
                  >
                    {processedImages.map((image, index) => (
                      <Grid item key={index} xs={2} sm={2}>
                        <Box
                          onClick={() => setSelectedImage(image.url)}
                          sx={{
                            cursor: "pointer",
                            height: 70,
                            width: "100%",
                            borderRadius: 1,
                            p: 0.5,
                            border:
                              selectedImage === image.url
                                ? "2px solid"
                                : "1px solid",
                            borderColor:
                              selectedImage === image.url
                                ? "primary.main"
                                : "divider",
                            bgcolor: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            "&:hover": {
                              borderColor: "primary.light",
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={image.url}
                            alt={`${product.name} thumbnail`}
                            sx={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              objectFit: "contain",
                              opacity: selectedImage === image.url ? 1 : 0.7,
                              transition: "opacity 0.2s",
                              "&:hover": {
                                opacity: 1,
                              },
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Column: Product Information */}
          <Grid item xs={12} md={5}>
            <Box sx={{ p: 3, height: "100%", width: "100%" }}>
              {/* Product Name */}
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                {product.name}
              </Typography>

              {/* Rating and Reviews */}
              <Box
                sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
              >
                <Rating
                  name="read-only"
                  value={4.5}
                  readOnly
                  precision={0.5}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  (24 reviews)
                </Typography>
              </Box>

              {/* Price */}
              <Typography
                variant="h4"
                color="primary"
                sx={{ mb: 3, fontWeight: 600 }}
              >
                {formatCurrency(product.price)}
              </Typography>

              {/* Stock Status and Quantity */}
              <Box
                sx={{ mb: 3, display: "flex", gap: 1, alignItems: "center" }}
              >
                <Chip
                  label={
                    product.status === "available" ? "In Stock" : "Out of Stock"
                  }
                  color={product.status === "available" ? "success" : "error"}
                  size="small"
                />
                {product.status === "available" && (
                  <Chip
                    label={`${product.stock} units left`}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Category */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  Category:
                </Typography>
                <Typography variant="body2">
                  {category ? category.name : "Loading category..."}
                </Typography>
              </Box>

              {/* Add to Cart Button */}
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                disabled={product.status !== "available" || loading}
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

              {/* Features Section */}
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
                        height: "100%",
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
