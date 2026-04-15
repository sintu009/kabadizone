import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: !!localStorage.getItem('scrapboyToken'),
  user: JSON.parse(localStorage.getItem('scrapboyUser') || 'null'),
};

const scrapboyAuthSlice = createSlice({
  name: 'scrapboyAuth',
  initialState,
  reducers: {
    scrapboyLogin(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('scrapboyToken', 'authenticated');
      localStorage.setItem('scrapboyUser', JSON.stringify(action.payload));
    },
    scrapboyLogout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('scrapboyToken');
      localStorage.removeItem('scrapboyUser');
    },
  },
});

export const { scrapboyLogin, scrapboyLogout } = scrapboyAuthSlice.actions;
export default scrapboyAuthSlice.reducer;
