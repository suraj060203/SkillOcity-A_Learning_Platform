import api from './api';

export const requestService = {
    async getAll(filters = {}) {
        const params = {};
        if (filters.subject) params.subject = filters.subject;
        if (filters.urgency) params.urgency = filters.urgency;
        if (filters.sortBy) params.sortBy = filters.sortBy;

        const { data } = await api.get('/requests', { params });
        return data;
    },
    async create(requestData) {
        // Use FormData if there's an attachment file
        if (requestData.attachment instanceof File) {
            const formData = new FormData();
            Object.entries(requestData).forEach(([key, value]) => {
                if (key === 'attachment') {
                    formData.append('attachment', value);
                } else if (key === 'preferredTime' && Array.isArray(value)) {
                    value.forEach(v => formData.append('preferredTime', v));
                } else {
                    formData.append(key, value);
                }
            });
            const { data } = await api.post('/requests', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        }

        const { data } = await api.post('/requests', requestData);
        return data;
    },
    async accept(requestId) {
        const { data } = await api.put(`/requests/${requestId}/accept`);
        return data;
    },
    async decline(requestId) {
        const { data } = await api.put(`/requests/${requestId}/decline`);
        return data;
    },
};

export default requestService;
