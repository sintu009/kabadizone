import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer, { logout } from '../modules/admin/features/authSlice';
import scrapboyAuthReducer from '../modules/scrapboy/features/scrapboyAuthSlice';
import scrapboyWalletReducer from '../modules/scrapboy/features/walletSlice';
import { onUnauthorized } from '../api/axios';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    scrapboyAuth: scrapboyAuthReducer,
    scrapboyWallet: scrapboyWalletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

onUnauthorized(() => store.dispatch(logout()));
