import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../config/axios';  

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("employes", {
        params: {
          include: 'departement'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Format the data as expected by the backend
      const formattedData = {
        name: userData.name,
        cin: userData.cin,
        rib: userData.rib,
        situationFamiliale: userData.situationFamiliale,
        nbEnfants: parseInt(userData.nbEnfants),
        adresse: userData.adresse,
        prenom: userData.prenom,
        tel: userData.tel,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        typeContrat: userData.typeContrat,
        date_naissance: userData.date_naissance,
        statut: userData.statut,
        departement_id: parseInt(userData.departement_id)
      };

      // Handle picture upload
      if (userData.picture) {
        if (typeof userData.picture === 'string') {
          formattedData.picture = userData.picture;
        } else {
          // If it's a File object, create FormData
          const formData = new FormData();
          Object.keys(formattedData).forEach(key => {
            formData.append(key, formattedData[key]);
          });
          formData.append('picture', userData.picture);
          
          const response = await api.post("employes", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          return response.data;
        }
      }

      const response = await api.post("employes", formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async (userData, { rejectWithValue }) => {
    try {
      // Format the data as expected by the backend
      const formattedData = [{
        id: userData.id,
        cin: userData.cin,
        rib: userData.rib,
        situationFamiliale: userData.situationFamiliale,
        nbEnfants: parseInt(userData.nbEnfants),
        adresse: userData.adresse,
        name: userData.name,
        prenom: userData.prenom,
        tel: userData.tel,
        email: userData.email,
        role: userData.role,
        typeContrat: userData.typeContrat,
        date_naissance: userData.date_naissance,
        statut: userData.statut,
        departement_id: parseInt(userData.departement_id)
      }];

      // Handle picture upload
      if (userData.picture) {
        if (typeof userData.picture === 'string') {
          // If it's a string (existing picture URL), just pass it as is
          formattedData[0].picture = userData.picture;
        } else if (userData.picture instanceof File) {
          // If it's a File object, create FormData
          const formData = new FormData();
          Object.keys(formattedData[0]).forEach(key => {
            formData.append(key, formattedData[0][key]);
          });
          formData.append('picture', userData.picture);
          
          const response = await api.put("employes", [formData], {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          return response.data;
        }
      }

      // If no picture or picture is a string, send regular JSON
      const response = await axios.put(API_ENDPOINTS.USERS.BASE, formattedData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteUsers = createAsyncThunk(
  'users/deleteUsers',
  async (ids, { rejectWithValue }) => {
    try {
      await api.delete("employes", { data: { ids } });
      return ids;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAuthenticatedUser = createAsyncThunk(
  'users/fetchAuthenticatedUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/user");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    authenticatedUser: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete users
      .addCase(deleteUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(u => !action.payload.includes(u.id));
      })
      .addCase(deleteUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch authenticated user
      .addCase(fetchAuthenticatedUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAuthenticatedUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.authenticatedUser = action.payload;
      })
      .addCase(fetchAuthenticatedUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default userSlice.reducer; 