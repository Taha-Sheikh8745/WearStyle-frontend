import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import axios from 'axios'
import { STATIC_PRODUCTS, STATIC_CATEGORIES, STATIC_USER } from './staticData'

// Set default base URL for API calls
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://wear-style-backend.vercel.app';

// Axios Request Interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios Response Interceptor for Global Error Handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401: Token expired or invalid
    if (error.response && error.response.status === 401) {
       localStorage.removeItem('token');
       localStorage.removeItem('user');
       window.location.href = '/login';
    }
    
    // Log error for debugging (Production Ready)
    const message = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
    console.error(`[API Error]: ${message}`, {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status
    });

    return Promise.reject(error);
  }
);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
