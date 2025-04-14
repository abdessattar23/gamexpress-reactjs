// src/pages/Unauthorized.jsx
import { Typography, Container, Box, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";

const Unauthorized = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            textAlign: "center",
            borderRadius: 2,
            backgroundColor: "background.paper",
            border: 1,
            borderColor: "error.light",
            maxWidth: 500,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "error.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 3,
            }}
          >
            <LockOutlined sx={{ fontSize: 40, color: "error.main" }} />
          </Box>

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "error.main",
              mb: 2,
            }}
          >
            403
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 3,
            }}
          >
            Unauthorized Access
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            You don't have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </Typography>

          <Button
            variant="contained"
            component={Link}
            to="/"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            Return to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized;
