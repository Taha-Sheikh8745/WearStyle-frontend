import api from './api';

const authService = {
    login: async (email, password) => {
        const { data } = await api.post('/api/users/login', { email, password });
        return data;
    },

    getProfile: async () => {
        const { data } = await api.get('/api/users/profile');
        return data;
    }
};

export default authService;
