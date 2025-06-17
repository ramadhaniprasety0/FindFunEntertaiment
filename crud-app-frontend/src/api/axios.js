import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_URL_IMAGE = import.meta.env.VITE_API_URL_IMAGE;
const API_URL_NEWS = import.meta.env.VITE_API_URL_NEWS;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const api_image = axios.create({
    baseURL: API_URL_IMAGE,
    headers:{
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export {api_image, API_URL_NEWS};
export default api;