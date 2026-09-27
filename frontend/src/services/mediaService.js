import api from './api';

export const mediaService = {
  getMediaAssets: async (params) => {
    const res = await api.get('/admin/media', { params });
    return res.data;
  },
  uploadMedia: async (formData) => {
    const res = await api.post('/admin/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },
  updateMediaAsset: async (id, data) => {
    const res = await api.patch(`/admin/media/${id}`, data);
    return res.data;
  },
  deleteMediaAsset: async (id) => {
    const res = await api.delete(`/admin/media/${id}`);
    return res.data;
  }
};
