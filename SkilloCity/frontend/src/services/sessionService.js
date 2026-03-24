import api from './api';

export const sessionService = {
    async getAll(filter) {
        const params = {};
        if (filter) params.status = filter;
        const { data } = await api.get('/sessions', { params });
        return data;
    },
    async getById(id) {
        const { data } = await api.get(`/sessions/${id}`);
        return data;
    },
    async cancel(id) {
        const { data } = await api.put(`/sessions/${id}/cancel`);
        return data;
    },
    async addNotes(id, notes) {
        const { data } = await api.put(`/sessions/${id}/notes`, { notes });
        return data;
    },
};

export default sessionService;
