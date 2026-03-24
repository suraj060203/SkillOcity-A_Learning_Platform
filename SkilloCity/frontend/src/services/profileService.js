import api from './api';

export const profileService = {
    async getProfile() {
        const { data } = await api.get('/profile');
        return data;
    },
    async updateProfile(profileData) {
        const { data } = await api.put('/profile', profileData);
        // Keep localStorage in sync
        localStorage.setItem('skillocity_user', JSON.stringify(data));
        return data;
    },
    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);
        const { data } = await api.post('/profile/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },
    async updateSettings(settings) {
        const { data } = await api.put('/profile/settings', settings);
        return data;
    },
};

export default profileService;
