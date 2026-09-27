import React, { useEffect, useState } from 'react';
import { technologyService } from '../services/technologyService';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import { Cpu, Plus, Edit, Trash2 } from 'lucide-react';

const Technology = () => {
  const [techList, setTechList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    technologyName: '',
    slug: '',
    description: '',
    technologyCategory: 'Computer Vision',
    icon: 'Cpu',
    status: 'PUBLISHED',
    displayOrder: 0
  });

  const toast = useToast();

  const fetchTech = async () => {
    try {
      setLoading(true);
      const res = await technologyService.getTechnologies();
      if (res.success) setTechList(res.data);
    } catch (err) {
      toast.error('Failed to load technology entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTech();
  }, []);

  const handleOpenModal = (t = null) => {
    if (t) {
      setSelectedTech(t);
      setFormData({
        technologyName: t.technologyName || '',
        slug: t.slug || '',
        description: t.description || '',
        technologyCategory: t.technologyCategory || 'Computer Vision',
        icon: t.icon || 'Cpu',
        status: t.status || 'PUBLISHED',
        displayOrder: t.displayOrder || 0
      });
    } else {
      setSelectedTech(null);
      setFormData({
        technologyName: '',
        slug: '',
        description: '',
        technologyCategory: 'Computer Vision',
        icon: 'Cpu',
        status: 'PUBLISHED',
        displayOrder: techList.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.technologyName) {
      toast.error('Technology name is required');
      return;
    }

    try {
      setSubmitting(true);
      if (selectedTech) {
        await technologyService.updateTechnology(selectedTech._id, formData);
        toast.success('Technology updated successfully!');
      } else {
        await technologyService.createTechnology(formData);
        toast.success('Technology created successfully!');
      }
      setIsModalOpen(false);
      fetchTech();
    } catch (err) {
      toast.error('Error saving technology');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete technology item?')) return;
    try {
      await technologyService.deleteTechnology(id);
      toast.success('Technology deleted');
      fetchTech();
    } catch (err) {
      toast.error('Failed to delete technology');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-7 h-7 text-emerald-600" />
            Technology Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Proprietary AI vision algorithms, DAQ hardware, and IoT connectivity stack.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Technology
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Technology Name</th>
                <th className="px-6 py-4">Category</th>
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
              ) : techList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-500">
                    No technology items found.
                  </td>
                </tr>
              ) : (
                techList.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">{t.technologyName}</td>
                    <td className="px-6 py-4 text-slate-600">{t.technologyCategory}</td>
                    <td className="px-6 py-4">
                      <Badge status={t.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(t)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
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
        title={selectedTech ? 'Edit Technology' : 'Create Technology'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Technology Name *</label>
            <input
              type="text"
              value={formData.technologyName}
              onChange={(e) => setFormData({ ...formData, technologyName: e.target.value })}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-1">Category</label>
            <input
              type="text"
              value={formData.technologyCategory}
              onChange={(e) => setFormData({ ...formData, technologyCategory: e.target.value })}
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
              {submitting ? 'Saving...' : 'Save Technology'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Technology;
