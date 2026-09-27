import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import FileUpload from '../components/FileUpload';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    productType: 'HARDWARE',
    category: '',
    heroContent: '',
    heroImage: '',
    brochure: '',
    datasheet: '',
    status: 'DRAFT',
    seoTitle: '',
    metaDescription: ''
  });

  const toast = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({
        page,
        limit: 10,
        search,
        category: categoryFilter,
        status: statusFilter,
        productType: typeFilter
      });
      if (res.success) {
        setProducts(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, categoryFilter, statusFilter, typeFilter]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openCreate') === 'true') {
      handleOpenModal(null);
    }
  }, [location.search]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        shortDescription: product.shortDescription || '',
        fullDescription: product.fullDescription || '',
        productType: product.productType || 'HARDWARE',
        category: product.category?._id || product.category || '',
        heroContent: product.heroContent || '',
        heroImage: product.heroImage || '',
        brochure: product.brochure || '',
        datasheet: product.datasheet || '',
        status: product.status || 'DRAFT',
        seoTitle: product.seoTitle || '',
        metaDescription: product.metaDescription || ''
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        slug: '',
        shortDescription: '',
        fullDescription: '',
        productType: 'HARDWARE',
        category: categories[0]?._id || '',
        heroContent: '',
        heroImage: '',
        brochure: '',
        datasheet: '',
        status: 'DRAFT',
        seoTitle: '',
        metaDescription: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error('Product name and category are required');
      return;
    }

    try {
      setSubmitting(true);
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct._id, formData);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created successfully!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleTogglePublish = async (product) => {
    try {
      if (product.status === 'PUBLISHED') {
        await productService.unpublishProduct(product._id);
        toast.success('Product unpublished');
      } else {
        await productService.publishProduct(product._id);
        toast.success('Product published');
      }
      fetchProducts();
    } catch (err) {
      toast.error('Failed to change product status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-7 h-7 text-emerald-600" />
            Products Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage inspection equipment, software platforms, specifications, and website publication.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
          >
            <option value="">All Product Types</option>
            <option value="HARDWARE">HARDWARE</option>
            <option value="SOFTWARE">SOFTWARE</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="DRAFT">DRAFT</option>
            <option value="UNPUBLISHED">UNPUBLISHED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="6" className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    No products matching search criteria.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{prod.name}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {prod.category?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600 border border-slate-200">
                        {prod.productType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={prod.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(prod.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(prod)}
                          title={prod.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            prod.status === 'PUBLISHED'
                              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {prod.status === 'PUBLISHED' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setViewProduct(prod)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(prod)}
                          title="Edit Product"
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          title="Delete Product"
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
        <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Create New Product'}
        subtitle="Manage product specifications, hero content, category, and publication status."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Vtest PTI Lane Pro-9000"
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Product Type</label>
              <select
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="HARDWARE">HARDWARE</option>
                <option value="SOFTWARE">SOFTWARE</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="UNPUBLISHED">UNPUBLISHED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <FileUpload
            label="Product Main Image"
            value={formData.heroImage || ''}
            onChange={(url) => setFormData({ ...formData, heroImage: url })}
            accept="image/*"
            placeholder="Upload image file or enter image URL..."
          />

          <FileUpload
            label="Product Technical Datasheet / PDF Document"
            value={formData.datasheet || ''}
            onChange={(url) => setFormData({ ...formData, datasheet: url })}
            accept=".pdf,.doc,.docx,application/pdf"
            placeholder="Upload PDF document or enter document URL..."
          />

          <div>
            <label className="block text-slate-700 font-bold mb-1">Full Description</label>
            <textarea
              rows="4"
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
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
              {selectedProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={Boolean(viewProduct)}
        onClose={() => setViewProduct(null)}
        title={viewProduct?.name || 'Product Details'}
        subtitle={`Category: ${viewProduct?.category?.name || 'N/A'}`}
      >
        {viewProduct && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800">{viewProduct.productType}</span>
              <Badge status={viewProduct.status} />
            </div>
            <div>
              <span className="block font-bold text-slate-900 mb-1">Short Description</span>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-200">{viewProduct.shortDescription || 'None'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-900 mb-1">Full Description</span>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 whitespace-pre-wrap">{viewProduct.fullDescription || 'None'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;
