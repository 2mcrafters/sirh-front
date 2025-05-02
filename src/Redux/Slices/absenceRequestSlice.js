import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axios';  

// Async thunks
export const fetchAbsenceRequests = createAsyncThunk(
  'absenceRequests/fetchAbsenceRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/absences", {
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
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/absences", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAbsenceRequest = createAsyncThunk(
  'absenceRequests/update',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put("/absences", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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
      await api.delete("/absences", { data: { ids } });
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
      const response = await api.put("absences", { status });
      // const response = await api.put(API_ENDPOINTS.ABSENCE_REQUESTS.STATUS(id), { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const absenceRequestSlice = createSlice({
  name: 'absenceRequests',
  initialState: {
    items: { absences: [] },
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
        if (!state.items.absences) {
          state.items.absences = [];
        }
        state.items.absences.push(action.payload);
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
        if (!state.items.absences) {
          state.items.absences = [];
        }
        const index = state.items.absences.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.items.absences[index] = action.payload;
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
        state.items = { absences: state.items.absences.filter(r => !action.payload.includes(r.id)) };
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
        if (!state.items.absences) {
          state.items.absences = [];
        }
        const index = state.items.absences.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.items.absences[index] = action.payload;
        }
      })
      .addCase(updateAbsenceRequestStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default absenceRequestSlice.reducer; 