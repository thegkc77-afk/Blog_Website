import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blog_app_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global responses & 401 token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (typeof error.response?.data === 'string' && (error.response.data.includes('Proxy error') || error.response.data.includes('500 Internal Server Error') || error.response.data.includes('ECONNREFUSED'))) {
      message = 'Backend server is not running or unreachable on port 5000. Please start the backend server.';
    } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      message = 'Network error: Backend server is offline or unreachable on port 5000.';
    } else if (error.response?.status === 500) {
      message = 'Internal Server Error (500). Please ensure backend server is started and connected.';
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const blogAPI = {
  getAll: async (search = '', category = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const response = await api.get(`/blogs?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  getUserBlogs: async () => {
    const response = await api.get('/blogs/user/me');
    return response.data;
  },

  create: async (blogData) => {
    const response = await api.post('/blogs', blogData);
    return response.data;
  },

  update: async (id, blogData) => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },
};

export default api;
