import api from './api';

export const projectService = {
  getProjects: async () => {
    const res = await api.get('/admin/projects');
    return res.data;
  },
  getProjectById: async (id) => {
    const res = await api.get(`/admin/projects/${id}`);
    return res.data;
  },
  createProject: async (data) => {
    const res = await api.post('/admin/projects', data);
    return res.data;
  },
  updateProject: async (id, data) => {
    const res = await api.patch(`/admin/projects/${id}`, data);
    return res.data;
  },
  deleteProject: async (id) => {
    const res = await api.delete(`/admin/projects/${id}`);
    return res.data;
  }
};
