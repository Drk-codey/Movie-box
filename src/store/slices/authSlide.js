import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockAuthAPI } from '../../service/mockAuthApi';

// Toggle between mock and real backend
const USE_MOCK_BACKEND = true; // Set to false when you have a real backend

// Helper function to set auth token in headers
const setAuthToken = (token) => {
  if (token) {
    // For future API calls (like adding favorites)
    window.authToken = token;
  } else {
    delete window.authToken;
  }
};

// Async thunk for authentication (e.g., login)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      let response;
      
      if (USE_MOCK_BACKEND) {
        // Use mock backend for development
        response = await mockAuthAPI.login({ email, password });
      } else {
        // Use real backend API
        response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Store token in httpOnly cookie (recommended) or localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Set axios default header for future requests
        setAuthToken(data.token);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed. Please try again.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // Validation
      if (!name || !email || !password) {
        return rejectWithValue('All fields are required');
      }

      if (password.length < 6) {
        return rejectWithValue('Password must be at least 6 characters');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return rejectWithValue('Please enter a valid email address');
      }

      let response;

      if (USE_MOCK_BACKEND) {
        // Use mock backend
        response = await mockAuthAPI.register({ name, email, password });
      } else {
        // Use real backend
        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
      }


      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
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
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      if (USE_MOCK_BACKEND) {
        // Use mock backend
        await mockAuthAPI.logout(token);
      } else {
        // Use real backend
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthToken(null);
      
      return true;
    } catch (error) {
      // Even if server request fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthToken(null);
      return rejectWithValue(error.message);
    }
  }
);

// VERIFY TOKEN (Auto-login on page refresh)
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      let response;

      if (USE_MOCK_BACKEND) {
        // Use mock backend
        response = await mockAuthAPI.verifyToken(token);
      } else {
        // Use real backend
        response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      if (!response.ok) {
        // Token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return rejectWithValue('Invalid token');
      }

      const data = await response.json();
      setAuthToken(data.token);

      return data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE USER PROFILE
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      let response;

      if (USE_MOCK_BACKEND) {
        response = await mockAuthAPI.updateProfile(token, updates);
      } else {
        response = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Update failed');
      }

      const data = await response.json();
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to set auth token
// const setAuthToken = (token) => {
//   if (token) {
//     // Set default header for all requests
//     window.axios = window.axios || {};
//     window.axios.defaults = window.axios.defaults || {};
//     window.axios.defaults.headers = window.axios.defaults.headers || {};
//     window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     delete window.axios?.defaults?.headers?.common['Authorization'];
//   }
// };

// ===== INITIAL STATE =====
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isLoading: false,
  isAuthenticated: !!storedToken,
  error: null,
  isInitialized: false, // To track if auth state is initialized
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
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
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
        state.user = null;
        state.token = null;
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
      // ===== LOGOUT =====
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Still clear state even if logout fails
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // ===== VERIFY TOKEN =====
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      })
      
      // ===== UPDATE PROFILE =====
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCredentials, clearCredentials, setInitialized } = authSlice.actions;
export default authSlice.reducer;