import React, { useEffect, useState } from 'react';
import { pageService } from '../services/pageService';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import { Globe, Plus, Edit, Trash2, Loader2 } from 'lucide-react';

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    pageName: '',
    slug: '',
    title: '',
    subtitle: '',
    content: '',
    status: 'PUBLISHED'
  });

  const toast = useToast();

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await pageService.getPages();
      if (res.success) setPages(res.data);
    } catch (err) {
      toast.error('Failed to load CMS pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleOpenModal = (p = null) => {
    if (p) {
      setSelectedPage(p);
      setFormData({
        pageName: p.pageName || '',
        slug: p.slug || '',
        title: p.title || '',
        subtitle: p.subtitle || '',
        content: p.content || '',
        status: p.status || 'PUBLISHED'
      });
    } else {
      setSelectedPage(null);
      setFormData({
        pageName: '',
        slug: '',
        title: '',
        subtitle: '',
        content: '',
        status: 'PUBLISHED'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pageName || !formData.title) {
      toast.error('Page name and title are required');
      return;
    }

    try {
      setSubmitting(true);
      if (selectedPage) {
        await pageService.updatePage(selectedPage._id, formData);
        toast.success('Page updated successfully!');
      } else {
        await pageService.createPage(formData);
        toast.success('Page created successfully!');
      }
      setIsModalOpen(false);
      fetchPages();
    } catch (err) {
      toast.error('Error saving CMS page');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this CMS page?')) return;
    try {
      await pageService.deletePage(id);
      toast.success('Page deleted');
      fetchPages();
    } catch (err) {
      toast.error('Failed to delete page');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="w-7 h-7 text-emerald-600" />
            CMS Page Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Static CMS pages like About Us, Privacy Policy, Terms & Conditions.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add CMS Page
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Page Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5" className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">
                    No CMS pages created yet.
                  </td>
                </tr>
              ) : (
                pages.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">{p.pageName}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-emerald-700 font-semibold">/{p.slug}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{p.title}</td>
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
        title={selectedPage ? 'Edit CMS Page' : 'Create CMS Page'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Page Name *</label>
            <input
              type="text"
              value={formData.pageName}
              onChange={(e) => setFormData({ ...formData, pageName: e.target.value })}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md"
            >
              {submitting ? 'Saving...' : 'Save Page'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Pages;
