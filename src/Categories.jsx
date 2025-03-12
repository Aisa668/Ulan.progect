import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  clearSuccessMessage,
} from "./categoriesSlice";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Categories = () => {
  const dispatch = useDispatch();
  const { items, loading, error, successMessage } = useSelector(
    (state) => state.categories
  );

  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const userRole = localStorage.getItem("role");
  const isAdmin = userRole && userRole.toUpperCase() === "ADMIN";

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setSnackbarMessage(successMessage);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000); // Очистка successMessage через 3 секунды
    }
  }, [successMessage, dispatch]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    dispatch(addCategory(newCategory));
    setNewCategory("");
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditedName(category.name);
  };

  const handleSaveEdit = () => {
    if (!editingCategory || !editedName.trim()) return;
    dispatch(
      updateCategory({ categoryId: editingCategory.id, newName: editedName })
    );
    setEditingCategory(null);
    setEditedName("");
  };

  const handleDeleteCategory = (categoryId) => {
    dispatch(deleteCategory(categoryId));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Категории
      </Typography>

      {error && (
        <Typography variant="body1" color="error" mb={2}>
          {error}
        </Typography>
      )}

      {/* Добавление категории */}
      {isAdmin && (
        <Grid container spacing={2} mb={3}>
          <Grid item xs={8}>
            <TextField
              label="Введите название категории"
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddCategory}
              disabled={loading}
            >
              {loading ? "Добавление..." : "Добавить категорию"}
            </Button>
          </Grid>
        </Grid>
      )}

      {/* Список категорий */}
      {loading && <Typography>Загрузка категорий...</Typography>}

      <List>
        {items.map((category) => (
          <ListItem key={category.id} divider>
            {editingCategory?.id === category.id ? (
              <>
                <TextField
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  size="small"
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveEdit}
                  disabled={loading}
                  sx={{ marginLeft: 1 }}
                >
                  Сохранить
                </Button>
              </>
            ) : (
              <>
                <ListItemText primary={category.name} />
                {isAdmin && (
                  <>
                    <IconButton
                      onClick={() => handleEditClick(category)}
                      color="primary"
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteCategory(category.id)}
                      color="secondary"
                      aria-label="delete"
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </>
            )}
          </ListItem>
        ))}
      </List>

      {/* Snackbar для сообщений */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Categories;
