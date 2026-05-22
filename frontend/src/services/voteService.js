import api from './api';

export const getPolls = (classId) => api.get('/polls', { params: { classId } });
export const getPollById = (id) => api.get(`/polls/${id}`);
export const createPoll = (data) => api.post('/polls', data);
export const closePoll = (id) => api.patch(`/polls/${id}/close`);
export const vote = (id, optionIds) => api.post(`/polls/${id}/vote`, { optionIds });
export const getPollResults = (id) => api.get(`/polls/${id}/results`);
export const announceWinner = (id) => api.post(`/polls/${id}/announce-winner`);
export const deletePoll = (id) => api.delete(`/polls/${id}`);
