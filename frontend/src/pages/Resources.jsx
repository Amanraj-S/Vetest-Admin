import React, { useEffect, useState } from 'react';
import { resourceService } from '../services/resourceService';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import FileUpload from '../components/FileUpload';
import { FileText, Plus, Edit, Trash2, Download, ExternalLink } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'WHITEPAPER',
    description: '',
    content: '',
    fileUrl: '',
    thumbnail: '',
    author: 'Vtest Editorial Team',
    status: 'PUBLISHED'
  });

  const toast = useToast();

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await resourceService.getResources({ type: typeFilter });
      if (res.success) setResources(res.data);
    } catch (err) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [typeFilter]);

  const handleOpenModal = (r = null) => {
    if (r) {
      setSelectedResource(r);
      setFormData({
        title: r.title || '',
        slug: r.slug || '',
        type: r.type || 'WHITEPAPER',
        description: r.description || '',
        content: r.content || '',
        fileUrl: r.fileUrl || '',
        thumbnail: r.thumbnail || '',
        author: r.author || 'Vtest Editorial Team',
        status: r.status || 'PUBLISHED'
      });
    } else {
      setSelectedResource(null);
      setFormData({
        title: '',
        slug: '',
        type: 'WHITEPAPER',
        description: '',
        content: '',
        fileUrl: '',
        thumbnail: '',
        author: 'Vtest Editorial Team',
        status: 'PUBLISHED'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    try {
      setSubmitting(true);
      if (selectedResource) {
        await resourceService.updateResource(selectedResource._id, formData);
        toast.success('Resource updated successfully!');
      } else {
        await resourceService.createResource(formData);
        toast.success('Resource created successfully!');
      }
      setIsModalOpen(false);
      fetchResources();
    } catch (err) {
      toast.error('Error saving resource');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete resource?')) return;
    try {
      await resourceService.deleteResource(id);
      toast.success('Resource deleted');
      fetchResources();
    } catch (err) {
      toast.error('Failed to delete resource');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-rose-600" />
            Resources & Downloads
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Technical whitepapers, PDF downloads, and product brochures.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-xs">
        <span className="text-xs font-bold text-slate-700">Filter by Resource Type:</span>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
        >
          <option value="">All Resource Types</option>
          <option value="WHITEPAPER">WHITEPAPER</option>
          <option value="BROCHURE">BROCHURE</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">PDF / Document</th>
                <th className="px-6 py-4">Author</th>
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
              ) : resources.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    No resources found.
                  </td>
                </tr>
              ) : (
                resources.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">{r.title}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-rose-600">{r.type}</td>
                    <td className="px-6 py-4">
                      {r.fileUrl ? (
                        <a
                          href={r.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 font-semibold text-[11px] inline-flex items-center gap-1.5 hover:bg-red-100"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF / Download File
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">No File</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{r.author}</td>
                    <td className="px-6 py-4">
                      <Badge status={r.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(r)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
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
        title={selectedResource ? 'Edit Resource' : 'Create Resource'}
        subtitle="Upload whitepapers, brochures, and technical documents."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Resource Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Vtest PTI System Architecture Whitepaper 2026"
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Resource Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="WHITEPAPER">WHITEPAPER</option>
                <option value="BROCHURE">BROCHURE</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Author / Publisher</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <FileUpload
            label="Upload Resource PDF / Attachment File"
            value={formData.fileUrl}
            onChange={(url) => setFormData({ ...formData, fileUrl: url })}
            accept=".pdf,.doc,.docx,application/pdf"
            placeholder="Upload PDF document or enter file URL..."
          />

          <FileUpload
            label="Upload Resource Cover Thumbnail Image"
            value={formData.thumbnail}
            onChange={(url) => setFormData({ ...formData, thumbnail: url })}
            accept="image/*"
            placeholder="Upload cover image or enter image URL..."
          />

          <div>
            <label className="block text-slate-700 font-bold mb-1">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Resources;
