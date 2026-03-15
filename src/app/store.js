import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from '../modules/admin/features/authSlice';
import scrapboyAuthReducer from '../modules/scrapboy/features/scrapboyAuthSlice';
import scrapboyWalletReducer from '../modules/scrapboy/features/walletSlice';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    scrapboyAuth: scrapboyAuthReducer,
    scrapboyWallet: scrapboyWalletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
