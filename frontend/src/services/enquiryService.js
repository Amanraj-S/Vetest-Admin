import api from './api';

export const enquiryService = {
  getEnquiries: async (params) => {
    const res = await api.get('/admin/enquiries', { params });
    return res.data;
  },
  getEnquiryById: async (id) => {
    const res = await api.get(`/admin/enquiries/${id}`);
    return res.data;
  },
  updateEnquiry: async (id, data) => {
    const res = await api.patch(`/admin/enquiries/${id}`, data);
    return res.data;
  },
  deleteEnquiry: async (id) => {
    const res = await api.delete(`/admin/enquiries/${id}`);
    return res.data;
  }
};
