import api from './api';

export const getPosts = () => api.get('/posts');
export const getPendingPosts = () => api.get('/posts/pending');
export const getMyPosts = () => api.get('/posts/my-posts');
export const getPostById = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const approvePost = (id, feedback) => api.patch(`/posts/${id}/approve`, { feedback });
export const rejectPost = (id, feedback) => api.patch(`/posts/${id}/reject`, { feedback });
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const reactToPost = (id, type) => api.post(`/posts/${id}/react`, { type });
export const addComment = (id, content) => api.post(`/posts/${id}/comment`, { content });
