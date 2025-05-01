import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import AppRoutes from './routes';
import { getCurrentUser } from './Redux/Slices/authSlice';

const App = () => {
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      store.dispatch(getCurrentUser());
    }
  }, []);

  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;
