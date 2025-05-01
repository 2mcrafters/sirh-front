import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

// Async thunks
export const fetchAbsenceRequests = createAsyncThunk(
  'absenceRequests/fetchAbsenceRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.ABSENCE_REQUESTS.BASE, {
        params: {
          include: 'user'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createAbsenceRequest = createAsyncThunk(
  'absenceRequests/createAbsenceRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.ABSENCE_REQUESTS.BASE, requestData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAbsenceRequest = createAsyncThunk(
  'absenceRequests/update',
  async (requestData, { rejectWithValue }) => {
    try {
      // Format the data as expected by the backend
      const formattedData = [{
        id: requestData.id,
        user_id: requestData.user_id,
        type: requestData.type,
        dateDebut: requestData.dateDebut,
        dateFin: requestData.dateFin,
        motif: requestData.motif || null,
        statut: requestData.statut || 'en_attente'
      }];

      const response = await axios.put(API_ENDPOINTS.ABSENCE_REQUESTS.BASE, formattedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAbsenceRequests = createAsyncThunk(
  'absenceRequests/deleteAbsenceRequests',
  async (ids, { rejectWithValue }) => {
    try {
      await axios.delete(API_ENDPOINTS.ABSENCE_REQUESTS.BASE, { data: { ids } });
      return ids;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAbsenceRequestStatus = createAsyncThunk(
  'absenceRequests/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(API_ENDPOINTS.ABSENCE_REQUESTS.STATUS(id), { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const absenceRequestSlice = createSlice({
  name: 'absenceRequests',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch absence requests
      .addCase(fetchAbsenceRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAbsenceRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAbsenceRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create absence request
      .addCase(createAbsenceRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAbsenceRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createAbsenceRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update absence request
      .addCase(updateAbsenceRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAbsenceRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateAbsenceRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete absence requests
      .addCase(deleteAbsenceRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAbsenceRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(r => !action.payload.includes(r.id));
      })
      .addCase(deleteAbsenceRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update status
      .addCase(updateAbsenceRequestStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAbsenceRequestStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateAbsenceRequestStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default absenceRequestSlice.reducer; 