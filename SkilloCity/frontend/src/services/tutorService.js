import api from './api';

const tutorService = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
            if (val !== undefined && val !== '') params.append(key, val);
        });
        const { data } = await api.get(`/tutors?${params.toString()}`);
        return data;
    },

    getRecommended: async () => {
        const { data } = await api.get('/tutors/recommended');
        return data;
    },

    search: async (query) => {
        if (!query || query.trim().length < 2) return [];
        const { data } = await api.get(`/tutors/search?q=${encodeURIComponent(query)}`);
        return data;
    },

    getById: async (id) => {
        const { data } = await api.get(`/tutors/${id}`);
        return data;
    },
};

export default tutorService;
