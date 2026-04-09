import api from './api';

const productService = {
    getAllProducts: async (params) => {
        const { data } = await api.get('/api/products', { params });
        return data;
    },

    getProductById: async (id) => {
        const { data } = await api.get(`/api/products/${id}`);
        return data;
    },

    createProduct: async (productData) => {
        // multipart/form-data for image uploads
        const { data } = await api.post('/api/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    updateProduct: async (id, productData) => {
        const { data } = await api.put(`/api/products/${id}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    deleteProduct: async (id) => {
        const { data } = await api.delete(`/api/products/${id}`);
        return data;
    },

    addReview: async (productId, reviewData) => {
        const { data } = await api.post(`/api/products/${productId}/reviews`, reviewData);
        return data;
    },
};

export default productService;
