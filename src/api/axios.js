import axios from 'axios';

let _token = localStorage.getItem('adminToken');
let _onUnauth = null;

export const setAuthToken = (t) => { _token = t; };
export const clearAuthToken = () => { _token = null; };
export const onUnauthorized = (fn) => { _onUnauth = fn; };

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  if (_token) config.headers.Authorization = `Bearer ${_token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) _onUnauth?.();
    return Promise.reject(err);
  }
);

export default apiClient;
