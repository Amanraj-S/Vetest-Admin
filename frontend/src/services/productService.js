import api from './api';

export const productService = {
  getProducts: async (params) => {
    const res = await api.get('/admin/products', { params });
    return res.data;
  },
  getProductById: async (id) => {
    const res = await api.get(`/admin/products/${id}`);
    return res.data;
  },
  createProduct: async (data) => {
    const res = await api.post('/admin/products', data);
    return res.data;
  },
  updateProduct: async (id, data) => {
    const res = await api.patch(`/admin/products/${id}`, data);
    return res.data;
  },
  deleteProduct: async (id) => {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  },
  publishProduct: async (id) => {
    const res = await api.post(`/admin/products/${id}/publish`);
    return res.data;
  },
  unpublishProduct: async (id) => {
    const res = await api.post(`/admin/products/${id}/unpublish`);
    return res.data;
  }
};
