
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Slices/authSlice';
import presenceStatsReducer from '../Slices/presenceStatsSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    presence: presenceStatsReducer,

   
  }
});
