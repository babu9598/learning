import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('droptaxi_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('droptaxi_admin_token');
      localStorage.removeItem('droptaxi_admin_user');
      if (window.location.pathname !== '/admin/login' && window.location.pathname !== '/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
