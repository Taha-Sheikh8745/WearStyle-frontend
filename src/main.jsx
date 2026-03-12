import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import axios from 'axios'
import { STATIC_PRODUCTS, STATIC_CATEGORIES, STATIC_USER } from './staticData'

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

// Axios Response Interceptor for Static Demo Fallback
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config } = error;
    // Intercept internal API calls for static demo
    if (config && config.url.startsWith('/api')) {
      console.warn(`Static Mode: Intercepting ${config.url}`);

      // Categories API
      if (config.url === '/api/categories') {
        return Promise.resolve({ data: { categories: STATIC_CATEGORIES, success: true } });
      }

      // Products list (filters, search, category)
      if (config.url === '/api/products' || config.url.startsWith('/api/products?')) {
        const urlParams = new URLSearchParams(config.url.split('?')[1]);
        const categoryFilter = urlParams.get('category');

        let filteredProducts = [...STATIC_PRODUCTS];
        if (categoryFilter && categoryFilter !== 'All') {
          // Find category ID or slug
          const cat = STATIC_CATEGORIES.find(c => c._id === categoryFilter || c.slug === categoryFilter);
          if (cat) {
            // Also include children if it's a parent
            const childIds = STATIC_CATEGORIES.filter(c => c.parent === cat._id).map(c => c._id);
            const targetIds = [cat._id, ...childIds];
            filteredProducts = STATIC_PRODUCTS.filter(p => targetIds.includes(p.category._id));
          }
        }

        return Promise.resolve({
          data: {
            products: filteredProducts,
            success: true,
            page: 1,
            pages: 1,
            total: filteredProducts.length
          }
        });
      }

      // Single Product Details
      if (config.url.startsWith('/api/products/')) {
        const id = config.url.split('/').pop();
        const product = STATIC_PRODUCTS.find(p => p._id === id) || STATIC_PRODUCTS[0];
        return Promise.resolve({ data: { product, success: true } });
      }

      // Auth / User Profile
      if (config.url === '/api/users/profile' || config.url === '/api/auth/me') {
        return Promise.resolve({ data: { user: STATIC_USER, success: true } });
      }

      // Mock successful login/registration
      if (config.url === '/api/auth/login' || config.url === '/api/auth/register') {
        return Promise.resolve({
          data: {
            success: true,
            user: STATIC_USER,
            token: 'static-demo-token'
          }
        });
      }
    }
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
