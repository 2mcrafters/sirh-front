import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

// Async thunks
export const fetchPointages = createAsyncThunk(
  'pointages/fetchPointages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.POINTAGES.BASE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPointage = createAsyncThunk(
  'pointages/createPointage',
  async (pointageData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.POINTAGES.BASE, pointageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePointage = createAsyncThunk(
  'pointages/updatePointage',
  async ({ id, ...pointageData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(API_ENDPOINTS.POINTAGES.BY_ID(id), pointageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePointages = createAsyncThunk(
  'pointages/deletePointages',
  async (ids, { rejectWithValue }) => {
    try {
      await axios.delete(API_ENDPOINTS.POINTAGES.BASE, { data: { ids } });
      return ids;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const pointageSlice = createSlice({
  name: 'pointages',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch pointages
      .addCase(fetchPointages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPointages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPointages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create pointage
      .addCase(createPointage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPointage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createPointage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update pointage
      .addCase(updatePointage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePointage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updatePointage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete pointages
      .addCase(deletePointages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePointages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(p => !action.payload.includes(p.id));
      })
      .addCase(deletePointages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default pointageSlice.reducer; 