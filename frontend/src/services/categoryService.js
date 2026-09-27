import api from './api';

export const categoryService = {
  getCategories: async () => {
    const res = await api.get('/admin/categories');
    return res.data;
  },
  createCategory: async (data) => {
    const res = await api.post('/admin/categories', data);
    return res.data;
  },
  updateCategory: async (id, data) => {
    const res = await api.patch(`/admin/categories/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  }
};
