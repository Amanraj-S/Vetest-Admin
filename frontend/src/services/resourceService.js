import api from './api';

export const resourceService = {
  getResources: async (params) => {
    const res = await api.get('/admin/resources', { params });
    return res.data;
  },
  getResourceById: async (id) => {
    const res = await api.get(`/admin/resources/${id}`);
    return res.data;
  },
  createResource: async (data) => {
    const res = await api.post('/admin/resources', data);
    return res.data;
  },
  updateResource: async (id, data) => {
    const res = await api.patch(`/admin/resources/${id}`, data);
    return res.data;
  },
  deleteResource: async (id) => {
    const res = await api.delete(`/admin/resources/${id}`);
    return res.data;
  }
};
