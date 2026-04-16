import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';

export const fetchAssignedPickups = createAsyncThunk(
  'scrapboyWallet/fetchPickups',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.PICKUP_REQUESTS.PICKUPS);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch pickups');
    }
  }
);

export const fetchDashboard = createAsyncThunk(
  'scrapboyWallet/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.COLLECTOR.DASHBOARD);
      return res.data || {};
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard');
    }
  }
);

export const fetchMyWallet = createAsyncThunk(
  'scrapboyWallet/fetchMyWallet',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { scrapboyAuth } = getState();
      const user = scrapboyAuth.user;
      const ownerId = user?.scrap_collector_id || user?.user_id;
      if (!ownerId) return { balance: 0 };
      const res = await apiClient.get(API_ENDPOINTS.WALLETS.BASE, {
        params: { owner_type: 'COLLECTOR', owner_id: ownerId },
      });
      return res.data || { balance: 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch wallet');
    }
  }
);

export const fetchMyTransactions = createAsyncThunk(
  'scrapboyWallet/fetchMyTransactions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { scrapboyAuth } = getState();
      const user = scrapboyAuth.user;
      const ownerId = user?.scrap_collector_id || user?.user_id;
      if (!ownerId) return [];
      const res = await apiClient.get(API_ENDPOINTS.WALLETS.TRANSACTIONS, {
        params: { owner_type: 'COLLECTOR', owner_id: ownerId },
      });
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const updatePickupStatus = createAsyncThunk(
  'scrapboyWallet/updateStatus',
  async ({ pickupRequestId, status }, { rejectWithValue }) => {
    try {
      await apiClient.put(API_ENDPOINTS.PICKUP_REQUESTS.UPDATE_STATUS(pickupRequestId), { status });
      return { pickupRequestId, status };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update status');
    }
  }
);

export const completePickupAsync = createAsyncThunk(
  'scrapboyWallet/completePickup',
  async ({ pickupRequestId, actual_weight, final_price, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('status', 'COMPLETED');
      formData.append('actual_weight', actual_weight);
      formData.append('final_price', final_price);
      if (image) formData.append('image', image);

      await apiClient.put(
        API_ENDPOINTS.PICKUP_REQUESTS.UPDATE_STATUS(pickupRequestId),
        formData,
        { headers: { 'Content-Type': undefined } }
      );
      return { pickupRequestId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to complete pickup');
    }
  }
);

const walletSlice = createSlice({
  name: 'scrapboyWallet',
  initialState: {
    pickups: [],
    dashboard: null,
    balance: 0,
    transactions: [],
    loading: false,
    walletLoading: false,
    error: null,
  },
  reducers: {
    resetWalletState(state) {
      Object.assign(state, { pickups: [], dashboard: null, balance: 0, transactions: [], loading: false, error: null });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedPickups.pending, (state) => { state.loading = true; })
      .addCase(fetchAssignedPickups.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.pickups = payload;
      })
      .addCase(fetchAssignedPickups.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchDashboard.fulfilled, (state, { payload }) => {
        state.dashboard = payload;
      })
      .addCase(fetchMyWallet.pending, (state) => { state.walletLoading = true; })
      .addCase(fetchMyWallet.fulfilled, (state, { payload }) => {
        state.walletLoading = false;
        state.balance = payload?.balance || 0;
      })
      .addCase(fetchMyWallet.rejected, (state) => { state.walletLoading = false; })
      .addCase(fetchMyTransactions.fulfilled, (state, { payload }) => {
        state.transactions = payload;
      })
      .addCase(updatePickupStatus.fulfilled, (state, { payload }) => {
        const p = state.pickups.find((x) => x.pickup_request_id === payload.pickupRequestId);
        if (p) p.status = payload.status;
      })
      .addCase(completePickupAsync.fulfilled, (state, { payload }) => {
        const p = state.pickups.find((x) => x.pickup_request_id === payload.pickupRequestId);
        if (p) p.status = 'COMPLETED';
      });
  },
});

export const { resetWalletState } = walletSlice.actions;
export default walletSlice.reducer;
