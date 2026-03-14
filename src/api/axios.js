import axios from 'axios';

// Create Axios instance with default config
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // Modify request config to add token if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response.data;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Handle specific errors like 401 Unauthorized here
    return Promise.reject(error);
  }
);

export default apiClient;
