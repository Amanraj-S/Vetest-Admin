import React, { useEffect, useState } from 'react';
import { industryService } from '../services/industryService';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';

const Industries = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    industryName: '',
    slug: '',
    description: '',
    heroImage: '',
    status: 'PUBLISHED'
  });

  const toast = useToast();

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const res = await industryService.getIndustries();
      if (res.success) setIndustries(res.data);
    } catch (err) {
      toast.error('Failed to load industries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleOpenModal = (ind = null) => {
    if (ind) {
      setSelectedIndustry(ind);
      setFormData({
        industryName: ind.industryName || '',
        slug: ind.slug || '',
        description: ind.description || '',
        heroImage: ind.heroImage || '',
        status: ind.status || 'PUBLISHED'
      });
    } else {
      setSelectedIndustry(null);
      setFormData({
        industryName: '',
        slug: '',
        description: '',
        heroImage: '',
        status: 'PUBLISHED'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.industryName) {
      toast.error('Industry name is required');
      return;
    }

    try {
      setSubmitting(true);
      if (selectedIndustry) {
        await industryService.updateIndustry(selectedIndustry._id, formData);
        toast.success('Industry updated successfully!');
      } else {
        await industryService.createIndustry(formData);
        toast.success('Industry created successfully!');
      }
      setIsModalOpen(false);
      fetchIndustries();
    } catch (err) {
      toast.error('Error saving industry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this industry?')) return;
    try {
      await industryService.deleteIndustry(id);
      toast.success('Industry deleted');
      fetchIndustries();
    } catch (err) {
      toast.error('Failed to delete industry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            Industries Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Industry sectors targeted by Vtest inspection and automation technologies.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Industry
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Industry Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="4" className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : industries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-500">
                    No industries found.
                  </td>
                </tr>
              ) : (
                industries.map((ind) => (
                  <tr key={ind._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">{ind.industryName}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-sm truncate">{ind.description}</td>
                    <td className="px-6 py-4">
                      <Badge status={ind.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(ind)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ind._id)}
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
        title={selectedIndustry ? 'Edit Industry' : 'Create Industry'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Industry Name *</label>
            <input
              type="text"
              value={formData.industryName}
              onChange={(e) => setFormData({ ...formData, industryName: e.target.value })}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
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
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md"
            >
              {submitting ? 'Saving...' : 'Save Industry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Industries;
