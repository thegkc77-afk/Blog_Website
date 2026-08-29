import axios from 'axios';

const API_BASE_URL = '/api';

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
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
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
