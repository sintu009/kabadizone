import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient, { setAuthToken, clearAuthToken } from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';

const persist = {
  save(token, user) {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    setAuthToken(token);
  },
  clear() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    clearAuthToken();
  },
  load() {
    return {
      token: localStorage.getItem('adminToken'),
      user: JSON.parse(localStorage.getItem('adminUser') || 'null'),
    };
  },
};

export const adminLogin = createAsyncThunk(
  'adminAuth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      if (!data.success) return rejectWithValue(data.message || 'Login failed');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Network error');
    }
  }
);

const { token, user } = persist.load();

const authSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    isAuthenticated: !!token,
    user,
    token,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      Object.assign(state, { isAuthenticated: false, user: null, token: null, error: null });
      persist.clear();
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = payload.token;
        state.user = payload.user;
        persist.save(payload.token, payload.user);
      })
      .addCase(adminLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
