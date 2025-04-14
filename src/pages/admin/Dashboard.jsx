import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { Games, Category, Group, Warning } from "@mui/icons-material";
import api from "../../api/axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total_products: 0,
    total_categories: 0,
    total_users: 0,
    out_of_stock_products: 0,
    latest_products: [],
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("v1/admin/dashboard");
        setStatistics({
          total_products: data.data.total_products || 0,
          total_categories: data.data.total_categories || 0,
          total_users: data.data.total_users || 0,
          out_of_stock_products: data.data.out_of_stock_products || 0,
          latest_products: data.data.latest_products || [],
        });
      } catch (error) {
        console.error("Failed to fetch dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: 1,
        borderColor: `${color}25`,
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 4px 20px ${color}15`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: color,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        <Typography
          variant="h4"
          component="div"
          sx={{ fontWeight: 600, mb: 1 }}
        >
          {value}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

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

  const dashboardStats = [
    {
      title: "Total Products",
      value: statistics.total_products,
      icon: <Games />,
      color: "#4F46E5",
    },
    {
      title: "Categories",
      value: statistics.total_categories,
      icon: <Category />,
      color: "#10B981",
    },
    {
      title: "Users",
      value: statistics.total_users,
      icon: <Group />,
      color: "#F59E0B",
    },
    {
      title: "Out of Stock",
      value: statistics.out_of_stock_products,
      icon: <Warning />,
      color: "#EF4444",
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MAD",
    }).format(amount);
  };

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user.user.name}! Here's what's happening with your
          store.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {statistics.latest_products.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: "linear-gradient(135deg, #4F46E508 0%, #4F46E502 100%)",
            border: 1,
            borderColor: "primary.100",
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Latest Products
          </Typography>
          <Grid container spacing={2}>
            {statistics.latest_products.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {formatCurrency(product.price)}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
