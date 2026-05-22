import api from './api';

export const getDashboardStats = () => api.get('/admin/stats');
export const getAllClasses = () => api.get('/admin/classes');
export const createClass = (data) => api.post('/admin/classes', data);
export const updateClass = (id, data) => api.put(`/admin/classes/${id}`, data);
export const deleteClass = (id) => api.delete(`/admin/classes/${id}`);
export const getAllUsers = (params) => api.get('/users', { params });
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateUserRole = (id, role) => api.patch(`/users/${id}/role`, { role });
