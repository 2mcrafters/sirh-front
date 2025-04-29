// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axios';  // Import de votre instance Axios

// État initial
const initialState = {
  user: null,
  token: null,
  roles: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Thunks pour les appels API (création des actions asynchrones)

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await api.post('/register', userData);  // Utiliser Axios
    localStorage.setItem('user', JSON.stringify(response.data));  // Sauvegarder l'utilisateur dans le stockage local
    return response.data;  // Retourner la réponse de l'API
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Erreur d’inscription');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await api.post('/login', credentials);  // Utiliser Axios
    localStorage.setItem('user', JSON.stringify(response.data));  // Sauvegarder l'utilisateur dans le stockage local
    return response.data;  // Retourner la réponse de l'API
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Erreur de connexion');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState().auth;
    await api.post('/logout', {}, {
      headers: { Authorization: `Bearer ${state.token}` }  // Utiliser le token d'authentification
    });
    localStorage.removeItem('user');
    return null;  // Retourner null lors de la déconnexion
  } catch (error) {
    return thunkAPI.rejectWithValue('Erreur lors de la déconnexion');
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState().auth;
    const response = await api.get('/me', {
      headers: { Authorization: `Bearer ${state.token}` }  // Utiliser le token d'authentification
    });
    return response.data;  // Retourner les données utilisateur
  } catch (error) {
    return thunkAPI.rejectWithValue('Impossible de récupérer les infos utilisateur');
  }
});

// Slice Redux pour l'authentification
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.roles = action.payload.roles;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.roles = action.payload.roles;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.token = null;
        state.roles = [];
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { resetState } = authSlice.actions;

export default authSlice.reducer;
