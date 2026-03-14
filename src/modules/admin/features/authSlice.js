import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: !!localStorage.getItem('adminToken'),
  user: JSON.parse(localStorage.getItem('adminUser') || 'null'),
};

const authSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('adminToken', 'authenticated');
      localStorage.setItem('adminUser', JSON.stringify(action.payload));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
