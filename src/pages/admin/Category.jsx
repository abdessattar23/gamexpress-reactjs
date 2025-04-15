import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Category as CategoryIcon,
} from "@mui/icons-material";
import api from "../../api/axios";
import * as yup from "yup";
import Loader from "../../components/Loader";

const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .min(3, "Name must be at least 3 characters"),
  slug: yup
    .string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
});

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/v1/admin/categories");
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        setCategories(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setCategories([]);
        setError("Received unexpected data format from server");
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setFormData({ name: category.name, slug: category.slug || "" });
      setCurrentCategoryId(category.id);
      setIsEditing(true);
    } else {
      setFormData({ name: "", slug: "" });
      setIsEditing(false);
      setCurrentCategoryId(null);
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug:
        prev.slug === "" ||
        prev.slug === prev.name.toLowerCase().replace(/\s+/g, "-")
          ? value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
          : prev.slug,
    }));
    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const validateForm = async () => {
    try {
      await categorySchema.validate(formData, { abortEarly: false });
      return true;
    } catch (err) {
      const errors = {};
      err.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setFormErrors(errors);
      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      if (isEditing) {
        await api.post(`/v1/admin/categories/${currentCategoryId}`, {
          ...formData,
          _method: "PUT",
        });
        setNotification({
          open: true,
          message: "Category updated successfully",
          severity: "success",
        });
      } else {
        await api.post("/v1/admin/categories", formData);
        setNotification({
          open: true,
          message: "Category added successfully",
          severity: "success",
        });
      }
      handleCloseDialog();
      fetchCategories();
    } catch (err) {
      setNotification({
        open: true,
        message: err.response?.data?.message || "Failed to save category",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await api.delete(`/v1/admin/categories/${id}`);
      setNotification({
        open: true,
        message: "Category deleted successfully",
        severity: "success",
      });
      fetchCategories();
    } catch (err) {
      setNotification({
        open: true,
        message: err.response?.data?.message || "Failed to delete category",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <Container maxWidth="lg">
      <Card
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: "background.paper",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CategoryIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Categories
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                px: 3,
                py: 1,
                backgroundColor: "primary.main",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              Add Category
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
        </Box>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow
                    key={category.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug || "N/A"}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(category)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(category.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      No categories found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            elevation: 0,
            sx: {
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              {isEditing ? "Edit Category" : "Add New Category"}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                error={!!formErrors.slug}
                helperText={
                  formErrors.slug ||
                  "URL-friendly identifier (auto-generated from name)"
                }
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              {isEditing ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
            elevation={6}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Card>
    </Container>
  );
};

export default Category;
