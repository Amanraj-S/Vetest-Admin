import api from './api';

export const technologyService = {
  getTechnologies: async () => {
    const res = await api.get('/admin/technology');
    return res.data;
  },
  getTechnologyById: async (id) => {
    const res = await api.get(`/admin/technology/${id}`);
    return res.data;
  },
  createTechnology: async (data) => {
    const res = await api.post('/admin/technology', data);
    return res.data;
  },
  updateTechnology: async (id, data) => {
    const res = await api.patch(`/admin/technology/${id}`, data);
    return res.data;
  },
  deleteTechnology: async (id) => {
    const res = await api.delete(`/admin/technology/${id}`);
    return res.data;
  }
};
