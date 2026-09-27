import api from './api';

export const industryService = {
  getIndustries: async () => {
    const res = await api.get('/admin/industries');
    return res.data;
  },
  getIndustryById: async (id) => {
    const res = await api.get(`/admin/industries/${id}`);
    return res.data;
  },
  createIndustry: async (data) => {
    const res = await api.post('/admin/industries', data);
    return res.data;
  },
  updateIndustry: async (id, data) => {
    const res = await api.patch(`/admin/industries/${id}`, data);
    return res.data;
  },
  deleteIndustry: async (id) => {
    const res = await api.delete(`/admin/industries/${id}`);
    return res.data;
  }
};
