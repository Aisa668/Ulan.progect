import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode"; // Импортируем jwtDecode

// Асинхронная операция для логина
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:7000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при авторизации");
      }

      return response.json(); // Возвращаем токен и данные пользователя
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронная операция для регистрации
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:7000/auth/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при регистрации");
      }

      return response.json(); // Возвращаем данные пользователя и токен
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Слайс для авторизации
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null, // Инициализация токена из localStorage
    role: localStorage.getItem("role") || null, // Инициализация роли из localStorage
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null; // Очистить роль при выходе
      localStorage.removeItem("token"); // Удалить токен из localStorage
      localStorage.removeItem("role"); // Удалить роль из localStorage
    },
    setAuthData: (state, action) => {
      // Сохраняем данные в Redux и localStorage
      state.token = action.payload.token;
      state.role = action.payload.role;
      localStorage.setItem("token", action.payload.token); // Сохраняем токен в localStorage
      localStorage.setItem("role", action.payload.role); // Сохраняем роль в localStorage
    },
  },
  extraReducers: (builder) => {
    // Обработка логина
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        const decodedToken = jwtDecode(action.payload.token);
        state.token = action.payload.token;
        state.role = decodedToken.role; // Сохраняем роль из токена
        // Сохраняем в localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("role", decodedToken.role);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Обработка регистрации
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        const decodedToken = jwtDecode(action.payload.token);
        state.role = decodedToken.role; // Сохраняем роль из токена
        // Сохраняем в localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("role", decodedToken.role);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setAuthData } = authSlice.actions;

export default authSlice.reducer;
