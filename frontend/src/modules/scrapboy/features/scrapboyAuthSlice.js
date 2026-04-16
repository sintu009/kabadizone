import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient, { setAuthToken, clearAuthToken } from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';

const persist = {
  save(token, user) {
    localStorage.setItem('scrapboyToken', token);
    localStorage.setItem('scrapboyUser', JSON.stringify(user));
    setAuthToken(token);
  },
  clear() {
    localStorage.removeItem('scrapboyToken');
    localStorage.removeItem('scrapboyUser');
    clearAuthToken();
  },
  load() {
    return {
      token: localStorage.getItem('scrapboyToken'),
      user: JSON.parse(localStorage.getItem('scrapboyUser') || 'null'),
    };
  },
};

export const scrapboyLoginAsync = createAsyncThunk(
  'scrapboyAuth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { username, password });
      if (!data.success) return rejectWithValue(data.message || 'Login failed');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Network error');
    }
  }
);

const { token, user } = persist.load();
if (token) setAuthToken(token);

const scrapboyAuthSlice = createSlice({
  name: 'scrapboyAuth',
  initialState: {
    isAuthenticated: !!token,
    user,
    token,
    loading: false,
    error: null,
  },
  reducers: {
    scrapboyLogout(state) {
      Object.assign(state, { isAuthenticated: false, user: null, token: null, error: null });
      persist.clear();
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(scrapboyLoginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scrapboyLoginAsync.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = payload.token;
        state.user = payload.user;
        persist.save(payload.token, payload.user);
      })
      .addCase(scrapboyLoginAsync.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { scrapboyLogout, clearError } = scrapboyAuthSlice.actions;
export default scrapboyAuthSlice.reducer;
