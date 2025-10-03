import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for authentication (e.g., login)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Store token in httpOnly cookie (recommended) or localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Set axios default header for future requests
        setAuthToken(data.token);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        setAuthToken(data.token);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Call logout endpoint to invalidate token on server
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Clear local storage
      localStorage.removeItem('token');
      setAuthToken(null);
      
      return true;
    } catch (error) {
      // Even if server request fails, clear local storage
      localStorage.removeItem('token');
      setAuthToken(null);
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to set auth token
const setAuthToken = (token) => {
  if (token) {
    // Set default header for all requests
    window.axios = window.axios || {};
    window.axios.defaults = window.axios.defaults || {};
    window.axios.defaults.headers = window.axios.defaults.headers || {};
    window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete window.axios?.defaults?.headers?.common['Authorization'];
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;