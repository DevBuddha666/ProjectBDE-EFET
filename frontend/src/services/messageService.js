import api from './api';

export const getMessages = () => api.get('/messages');
export const getMessageThread = (userId) => api.get(`/messages/${userId}`);
export const sendMessage = (data) => api.post('/messages', data);
export const markAsRead = (id) => api.patch(`/messages/${id}/read`);
