import api from './api';

export const dashboardService = {
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  }
};
