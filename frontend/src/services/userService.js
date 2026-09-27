import api from './api';

export const userService = {
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  createUser: async (data) => {
    const res = await api.post('/admin/users', data);
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await api.patch(`/admin/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  }
};
