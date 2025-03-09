import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Получение списка категорий
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:7000/category");
      if (!response.ok) {
        throw new Error("Ошибка загрузки категорий");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Добавление новой категории
export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (categoryName, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Токен не найден. Войдите в систему.");
      }

      const response = await fetch("http://localhost:7000/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении категории");
      }

      const newCategory = await response.json();
      return newCategory;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Удаление категории
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Токен не найден. Войдите в систему.");
      }

      const response = await fetch(
        `http://localhost:7000/category/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при удалении категории");
      }

      return categoryId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Обновление категории
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ categoryId, newName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Токен не найден. Войдите в систему.");
      }

      const response = await fetch(
        `http://localhost:7000/category/${categoryId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при обновлении категории");
      }

      return { categoryId, newName };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
    successMessage: "",
  },
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение категорий
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Добавление категории
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.successMessage = "Категория успешно добавлена!";
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Удаление категории
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (category) => category.id !== action.payload
        );
        state.successMessage = "Категория удалена успешно!";
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Обновление категории
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (category) => category.id === action.payload.categoryId
        );
        if (index !== -1) {
          state.items[index].name = action.payload.newName;
        }
        state.successMessage = "Категория обновлена успешно!";
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSuccessMessage } = categoriesSlice.actions;
export default categoriesSlice.reducer;
