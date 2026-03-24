import api from './api';

export const authService = {
    async login(email, password) {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('skillocity_token', data.token);
        localStorage.setItem('skillocity_user', JSON.stringify(data.user));
        return data;
    },
    async signup(signupData) {
        const { data } = await api.post('/auth/register', signupData);
        localStorage.setItem('skillocity_token', data.token);
        localStorage.setItem('skillocity_user', JSON.stringify(data.user));
        return data;
    },
    async logout() {
        localStorage.removeItem('skillocity_token');
        localStorage.removeItem('skillocity_user');
    },
    getCurrentUser() {
        const user = localStorage.getItem('skillocity_user');
        return user ? JSON.parse(user) : null;
    },
    getToken() {
        return localStorage.getItem('skillocity_token');
    },
};

export default authService;
