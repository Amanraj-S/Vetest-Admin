import React, { useEffect, useState } from 'react';
import { categoryService } from '../services/categoryService';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import { FolderTree, Plus, Edit, Trash2, Loader2 } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    status: 'PUBLISHED',
    displayOrder: 0,
    seoTitle: '',
    metaDescription: ''
  });

  const toast = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setSelectedCategory(cat);
      setFormData({
        name: cat.name || '',
        slug: cat.slug || '',
        description: cat.description || '',
        image: cat.image || '',
        status: cat.status || 'PUBLISHED',
        displayOrder: cat.displayOrder || 0,
        seoTitle: cat.seoTitle || '',
        metaDescription: cat.metaDescription || ''
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        status: 'PUBLISHED',
        displayOrder: categories.length + 1,
        seoTitle: '',
        metaDescription: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory._id, formData);
        toast.success('Category updated successfully!');
      } else {
        await categoryService.createCategory(formData);
        toast.success('Category created successfully!');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderTree className="w-7 h-7 text-emerald-600" />
            Categories Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize vehicle testing hardware, software platforms, and sensor product lines.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5" className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">
                    No categories found. Click 'Add New Category' to create one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-500">#{cat.displayOrder}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">{cat.name}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge status={cat.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
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
        title={selectedCategory ? 'Edit Category' : 'Create Category'}
        subtitle="Specify category details and display order."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Computer Vision & AI Systems"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="UNPUBLISHED">UNPUBLISHED</option>
              </select>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {selectedCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
