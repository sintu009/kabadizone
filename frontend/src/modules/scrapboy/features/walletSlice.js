import { createSlice } from '@reduxjs/toolkit';

// Simple flow: Assigned → Started → Completed | Cancelled
const INITIAL_PICKUPS = [
  { id: 'PK-1003', customer: 'Amit Kumar', phone: '98XXXXXX12', address: 'Laxmi Nagar, Delhi', lat: 28.6304, lng: 77.2777, date: '2025-01-20', timeSlot: '10:00 AM - 12:00 PM', scrapTypes: ['Plastic', 'E-Waste'], estimatedWeight: '~5 kg', estimatedAmount: 350, status: 'Assigned' },
  { id: 'PK-1006', customer: 'Neha Gupta', phone: '98XXXXXX15', address: 'Andheri West, Mumbai', lat: 19.1364, lng: 72.8296, date: '2025-01-20', timeSlot: '2:00 PM - 4:00 PM', scrapTypes: ['E-Waste'], estimatedWeight: '~2 kg', estimatedAmount: 200, status: 'Assigned' },
  { id: 'PK-1010', customer: 'Kavita Rao', phone: '98XXXXXX19', address: 'Whitefield, Bangalore', lat: 12.9698, lng: 77.7500, date: '2025-01-20', timeSlot: '10:00 AM - 12:00 PM', scrapTypes: ['Paper', 'E-Waste'], estimatedWeight: '~7 kg', estimatedAmount: 280, status: 'Started' },
  { id: 'PK-0998', customer: 'Rahul Sharma', phone: '98XXXXXX10', address: 'Sector 12, Noida', lat: 28.5855, lng: 77.3100, date: '2025-01-19', timeSlot: '10:00 AM - 12:00 PM', scrapTypes: ['Paper', 'Cardboard'], estimatedWeight: '~12 kg', estimatedAmount: 180, status: 'Completed' },
  { id: 'PK-0995', customer: 'Priya Patel', phone: '98XXXXXX11', address: 'MG Road, Gurgaon', lat: 28.4595, lng: 77.0266, date: '2025-01-18', timeSlot: '2:00 PM - 4:00 PM', scrapTypes: ['Metal', 'Iron'], estimatedWeight: '~8 kg', estimatedAmount: 520, status: 'Completed' },
  { id: 'PK-0990', customer: 'Vikram Singh', phone: '98XXXXXX14', address: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167, date: '2025-01-17', timeSlot: '4:00 PM - 6:00 PM', scrapTypes: ['Iron'], estimatedWeight: '~18 kg', estimatedAmount: 450, status: 'Cancelled' },
];

const INITIAL_TRANSACTIONS = [
  { id: 1, type: 'credit', label: 'Admin added funds', amount: 5000, date: '2025-01-19', paymentMode: null },
  { id: 2, type: 'debit', label: 'Pickup #PK-0998 - Rahul S.', amount: 180, date: '2025-01-18', paymentMode: 'Cash' },
  { id: 3, type: 'debit', label: 'Pickup #PK-0995 - Priya M.', amount: 520, date: '2025-01-17', paymentMode: 'GPay' },
];

const persist = (state) => localStorage.setItem('scrapboyWallet', JSON.stringify(state));
const saved = JSON.parse(localStorage.getItem('scrapboyWallet') || 'null');

const initialState = saved || {
  balance: 4300,
  pickups: INITIAL_PICKUPS,
  transactions: INITIAL_TRANSACTIONS,
};

const walletSlice = createSlice({
  name: 'scrapboyWallet',
  initialState,
  reducers: {
    // Accept = directly start the pickup
    acceptPickup(state, action) {
      const pickup = state.pickups.find((p) => p.id === action.payload);
      if (pickup && pickup.status === 'Assigned') {
        pickup.status = 'Started';
        persist(state);
      }
    },
    rejectPickup(state, action) {
      const pickup = state.pickups.find((p) => p.id === action.payload);
      if (pickup && pickup.status === 'Assigned') {
        pickup.status = 'Cancelled';
        persist(state);
      }
    },
    completePickup(state, action) {
      const { pickupId, amount, paymentMode } = action.payload;
      const pickup = state.pickups.find((p) => p.id === pickupId);
      if (!pickup || pickup.status !== 'Started') return;
      pickup.status = 'Completed';
      state.balance = Math.max(0, state.balance - amount);
      state.transactions.unshift({
        id: Date.now(),
        type: 'debit',
        label: `Pickup ${pickupId} - ${pickup.customer}`,
        amount,
        date: new Date().toISOString().split('T')[0],
        paymentMode,
      });
      persist(state);
    },
    addFunds(state, action) {
      state.balance += action.payload;
      state.transactions.unshift({
        id: Date.now(),
        type: 'credit',
        label: 'Admin added funds',
        amount: action.payload,
        date: new Date().toISOString().split('T')[0],
        paymentMode: null,
      });
      persist(state);
    },
  },
});

export const { acceptPickup, rejectPickup, completePickup, addFunds } = walletSlice.actions;
export default walletSlice.reducer;
