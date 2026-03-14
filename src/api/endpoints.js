export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  SCRAPBOY: {
    PROFILE: '/scrapboy/profile',
    ORDERS: '/scrapboy/orders',
  },
  ADMIN: {
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
    SCRAP_PRICES: '/admin/scrap-prices',
    SCRAP_BOYS: '/admin/scrapboys',
    SCRAP_BOY_DETAIL: (id) => `/admin/scrapboys/${id}`,
    WALLET: '/admin/wallet',
    WALLET_TRANSACTION: '/admin/wallet/transaction',
    BOOKINGS: '/admin/bookings',
    ASSIGN_BOOKING: (id) => `/admin/bookings/${id}/assign`,
  },
};
