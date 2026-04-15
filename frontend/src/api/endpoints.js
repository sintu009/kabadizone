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
    SCRAP_COLLECTORS: '/scrap-collectors',
  },
  WALLETS: {
    BASE: '/wallets',
    CREDIT: '/wallets/credit',
    DEBIT: '/wallets/debit',
    TRANSACTIONS: '/wallets/transactions',
  },
  PICKUP_REQUESTS: {
    BASE: '/pickup-requests',
    PICKUPS: '/pickup-requests/pickups',
    GUEST: '/pickup-requests/guest',
    GUEST_STATUS: '/pickup-requests/guest/status',
    UPDATE_STATUS: (id) => `/pickup-requests/pickups/${id}/status`,
  },
  PICKUP_ASSIGNMENTS: {
    BASE: '/pickup-assignments',
  },
  SLOT_TIMES: {
    BASE: '/slot-times',
  },
  GARBAGE: {
    TYPES: '/garbage-types',
    UNITS: '/master-garbage-unit',
    PRICES: '/garbage-prices',
  },
};
