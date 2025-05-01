import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import userReducer from './Slices/userSlice';
import departmentReducer from './Slices/departementSlice';
import absenceRequestReducer from './Slices/absenceRequestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    departments: departmentReducer,
    absenceRequests: absenceRequestReducer,
  },
}); 