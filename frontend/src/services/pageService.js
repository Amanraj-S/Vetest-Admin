import api from './api';

export const pageService = {
  getPages: async () => {
    const res = await api.get('/admin/pages');
    return res.data;
  },
  getPageById: async (id) => {
    const res = await api.get(`/admin/pages/${id}`);
    return res.data;
  },
  createPage: async (data) => {
    const res = await api.post('/admin/pages', data);
    return res.data;
  },
  updatePage: async (id, data) => {
    const res = await api.patch(`/admin/pages/${id}`, data);
    return res.data;
  },
  deletePage: async (id) => {
    const res = await api.delete(`/admin/pages/${id}`);
    return res.data;
  }
};
