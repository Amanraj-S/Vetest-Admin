import React, { useEffect, useState } from 'react';
import { projectService } from '../services/projectService';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import FileUpload from '../components/FileUpload';
import { Briefcase, Plus, Edit, Trash2, Star, Download, FileText } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    projectTitle: '',
    slug: '',
    clientName: 'Demo Client (Placeholder)',
    industry: 'Automotive Inspection',
    summary: '',
    challenge: '',
    solution: '',
    heroImage: '',
    pdfUrl: '',
    status: 'PUBLISHED',
    featured: false
  });

  const toast = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getProjects();
      if (res.success) setProjects(res.data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (p = null) => {
    if (p) {
      setSelectedProject(p);
      setFormData({
        projectTitle: p.projectTitle || '',
        slug: p.slug || '',
        clientName: p.clientName || 'Demo Client (Placeholder)',
        industry: p.industry || 'Automotive Inspection',
        summary: p.summary || '',
        challenge: p.challenge || '',
        solution: p.solution || '',
        heroImage: p.heroImage || '',
        pdfUrl: p.pdfUrl || '',
        status: p.status || 'PUBLISHED',
        featured: Boolean(p.featured)
      });
    } else {
      setSelectedProject(null);
      setFormData({
        projectTitle: '',
        slug: '',
        clientName: 'Demo Client (Placeholder)',
        industry: 'Automotive Inspection',
        summary: '',
        challenge: '',
        solution: '',
        heroImage: '',
        pdfUrl: '',
        status: 'PUBLISHED',
        featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectTitle) {
      toast.error('Project title is required');
      return;
    }

    try {
      setSubmitting(true);
      if (selectedProject) {
        await projectService.updateProject(selectedProject._id, formData);
        toast.success('Project updated successfully!');
      } else {
        await projectService.createProject(formData);
        toast.success('Project created successfully!');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error('Error saving project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectService.deleteProject(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-purple-600" />
            Projects / Case Studies
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage client implementation projects, PDF case studies, and hero images.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Case Study
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Project PDF</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="6" className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">{p.projectTitle}</td>
                    <td className="px-6 py-4 text-slate-600">{p.clientName}</td>
                    <td className="px-6 py-4">
                      {p.pdfUrl ? (
                        <a
                          href={p.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[11px] inline-flex items-center gap-1.5 hover:bg-purple-100"
                        >
                          <Download className="w-3.5 h-3.5" /> Case Study PDF
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">No PDF</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Featured
                        </span>
                      ) : (
                        <span className="text-slate-400">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(p)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProject ? 'Edit Project / Case Study' : 'Create Project / Case Study'}
        subtitle="Upload case study PDFs, hero images, and project descriptions."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Project Title *</label>
            <input
              type="text"
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              placeholder="e.g. Automated PTI Lane Modernization"
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Client Name</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <FileUpload
            label="Upload Project Image"
            value={formData.heroImage}
            onChange={(url) => setFormData({ ...formData, heroImage: url })}
            accept="image/*"
            placeholder="Upload hero image or enter image URL..."
          />

          <FileUpload
            label="Upload Project Case Study PDF Document"
            value={formData.pdfUrl}
            onChange={(url) => setFormData({ ...formData, pdfUrl: url })}
            accept=".pdf,.doc,.docx,application/pdf"
            placeholder="Upload PDF document or enter file URL..."
          />

          <div>
            <label className="block text-slate-700 font-bold mb-1">Project Description & Summary</label>
            <textarea
              rows="3"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Overview of project implementation, scope, and objectives..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
