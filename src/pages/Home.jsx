import { Box, Container, Typography, Button, Paper, Grid } from "@mui/material";
import { SportsEsports, ShoppingCart, Security } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <SportsEsports sx={{ fontSize: 40 }} />,
      title: "Latest Games",
      description: "Discover the newest and most exciting games",
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      title: "Easy Shopping",
      description: "Simple and secure checkout process",
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: "Secure Platform",
      description: "Your transactions are always protected",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(45deg, #4F46E5 30%, #818CF8 90%)",
          color: "white",
          py: { xs: 8, md: 12 },
          borderRadius: 2,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Welcome to GameXpress
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 400,
                }}
              >
                Your Ultimate Gaming Destination
              </Typography>
              {!isAuthenticated ? (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "white",
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.9)",
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.9)",
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              ) : (
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Welcome back, {user.user.user?.name}!
                </Typography>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  backgroundColor: "background.paper",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    color: "primary.main",
                    mb: 2,
                    p: 2,
                    borderRadius: "50%",
                    backgroundColor: "primary.lighter",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
