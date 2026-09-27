import api from './api';

export const solutionService = {
  getSolutions: async () => {
    const res = await api.get('/admin/solutions');
    return res.data;
  },
  getSolutionById: async (id) => {
    const res = await api.get(`/admin/solutions/${id}`);
    return res.data;
  },
  createSolution: async (data) => {
    const res = await api.post('/admin/solutions', data);
    return res.data;
  },
  updateSolution: async (id, data) => {
    const res = await api.patch(`/admin/solutions/${id}`, data);
    return res.data;
  },
  deleteSolution: async (id) => {
    const res = await api.delete(`/admin/solutions/${id}`);
    return res.data;
  }
};
