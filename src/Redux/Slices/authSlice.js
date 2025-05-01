import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await axios.post('/api/login', credentials);
    const { access_token, user, roles } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('token', access_token);
    
    // Set default axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    return { user, roles };
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const response = await axios.post('/api/register', userData);
    const { access_token, user, roles } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('token', access_token);
    
    // Set default axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    return { user, roles };
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await axios.post('/api/logout');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const response = await axios.get('/api/me');
    return response.data;
  }
);

export const assignRole = createAsyncThunk(
  'auth/assignRole',
  async ({ userId, role }) => {
    const response = await axios.post('/api/assign-role', { user_id: userId, role });
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    roles: [],
    status: 'idle',
    error: null,
    isAuthenticated: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.status = 'idle';
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.status = 'failed';
        state.isAuthenticated = false;
      })
      // Assign Role
      .addCase(assignRole.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.user.id) {
          state.user = action.payload.user;
          state.roles = action.payload.roles;
        }
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
