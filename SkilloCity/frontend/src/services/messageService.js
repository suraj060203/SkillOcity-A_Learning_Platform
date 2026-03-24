import api from './api';

export const messageService = {
    async getConversations() {
        const { data } = await api.get('/conversations');
        return data;
    },
    async getMessages(conversationId) {
        const { data } = await api.get(`/conversations/${conversationId}/messages`);
        return data;
    },
    async sendMessage(conversationId, text) {
        const { data } = await api.post(`/conversations/${conversationId}/messages`, { text });
        return data;
    },
    async sendFileMessage(conversationId, file) {
        const formData = new FormData();
        formData.append('attachment', file);
        const { data } = await api.post(
            `/conversations/${conversationId}/messages/upload`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 }
        );
        return data;
    },
};

export default messageService;
