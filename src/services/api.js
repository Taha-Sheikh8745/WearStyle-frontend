import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_SECRET_KEY || 'mysecret123';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_KEY,
    },
});

export default api;
