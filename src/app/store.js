import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from '../modules/admin/features/authSlice';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
