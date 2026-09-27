import React, { useEffect, useState } from 'react';
import { solutionService } from '../services/solutionService';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import FileUpload from '../components/FileUpload';
import { Lightbulb, Plus, Edit, Trash2 } from 'lucide-react';

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    heroImage: '',
    featuresText: '',
    benefitsText: '',
    status: 'PUBLISHED'
  });

  const toast = useToast();

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const res = await solutionService.getSolutions();
      if (res.success) setSolutions(res.data);
    } catch (err) {
      toast.error('Failed to load solutions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const handleOpenModal = (sol = null) => {
    if (sol) {
      setSelectedSolution(sol);
      setFormData({
        name: sol.name || '',
        slug: sol.slug || '',
        description: sol.description || '',
        heroImage: sol.heroImage || '',
        featuresText: (sol.features || []).join('\n'),
        benefitsText: (sol.benefits || []).join('\n'),
        status: sol.status || 'PUBLISHED'
      });
    } else {
      setSelectedSolution(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        heroImage: '',
        featuresText: '',
        benefitsText: '',
        status: 'PUBLISHED'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Solution name is required');
      return;
    }

    const payload = {
      ...formData,
      features: formData.featuresText.split('\n').filter(Boolean),
      benefits: formData.benefitsText.split('\n').filter(Boolean)
    };

    try {
      setSubmitting(true);
      if (selectedSolution) {
        await solutionService.updateSolution(selectedSolution._id, payload);
        toast.success('Solution updated successfully!');
      } else {
        await solutionService.createSolution(payload);
        toast.success('Solution created successfully!');
      }
      setIsModalOpen(false);
      fetchSolutions();
    } catch (err) {
      toast.error('Error saving solution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this solution?')) return;
    try {
      await solutionService.deleteSolution(id);
      toast.success('Solution deleted successfully');
      fetchSolutions();
    } catch (err) {
      toast.error('Failed to delete solution');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Lightbulb className="w-7 h-7 text-amber-600" />
            Solutions Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Turnkey enterprise solutions for transport authorities and automotive OEM lines.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Solution
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Solution Name</th>
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
              ) : solutions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-500">
                    No solutions found.
                  </td>
                </tr>
              ) : (
                solutions.map((sol) => (
                  <tr key={sol._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">{sol.name}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-sm truncate">{sol.description}</td>
                    <td className="px-6 py-4">
                      <Badge status={sol.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(sol)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sol._id)}
                          className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
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
        title={selectedSolution ? 'Edit Solution' : 'Create Solution'}
        subtitle="Manage solution overview, hero images, and feature details."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Solution Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <FileUpload
            label="Solution Hero / Banner Image"
            value={formData.heroImage}
            onChange={(url) => setFormData({ ...formData, heroImage: url })}
            accept="image/*"
            placeholder="Upload solution banner image or enter image URL..."
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

          <div>
            <label className="block text-slate-700 font-bold mb-1">Key Features (One per line)</label>
            <textarea
              rows="3"
              value={formData.featuresText}
              onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
              placeholder="e.g. Real-time Licensing Database Sync&#10;Tamper-proof Digital Certificate"
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
              className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Solution'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Solutions;
