// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Slices/authSlice';
import departementReducer from '../Slices/departementSlice';
import userReducer from '../Slices/userSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
  
  }
});
