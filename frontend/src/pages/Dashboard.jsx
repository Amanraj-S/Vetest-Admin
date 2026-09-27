import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/Badge';
import Skeleton from '../components/Skeleton';
import {
  Package,
  FolderTree,
  Lightbulb,
  Building2,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  CheckCircle2,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getDashboardStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        toast.error('Failed to load MongoDB dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  const { stats, recentProducts = [], recentEnquiries = [], recentActivity = [] } = data || {};

  const statCards = [
    { label: 'Total Products', count: stats?.totalProducts, sub: `${stats?.publishedProducts || 0} Published`, icon: Package, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', link: '/admin/products' },
    { label: 'Published Products', count: stats?.publishedProducts, sub: `${stats?.draftProducts || 0} Drafts`, icon: CheckCircle2, color: 'text-emerald-800 bg-emerald-100 border-emerald-300', link: '/admin/products' },
    { label: 'Categories', count: stats?.totalCategories, sub: 'Product taxonomy', icon: FolderTree, color: 'text-teal-700 bg-teal-50 border-teal-200', link: '/admin/categories' },
    { label: 'Solutions', count: stats?.totalSolutions, sub: 'Core offerings', icon: Lightbulb, color: 'text-amber-700 bg-amber-50 border-amber-200', link: '/admin/solutions' },
    { label: 'Industries', count: stats?.totalIndustries, sub: 'Target sectors', icon: Building2, color: 'text-indigo-700 bg-indigo-50 border-indigo-200', link: '/admin/industries' },
    { label: 'Projects / Cases', count: stats?.totalProjects, sub: 'Case studies', icon: Briefcase, color: 'text-purple-700 bg-purple-50 border-purple-200', link: '/admin/projects' },
    { label: 'New Enquiries', count: stats?.newEnquiries, sub: `${stats?.openEnquiries || 0} Active total`, icon: MessageSquare, color: 'text-blue-700 bg-blue-50 border-blue-200', link: '/admin/enquiries' },
    { label: 'Media Assets', count: stats?.totalMediaAssets, sub: 'Images & Docs', icon: ImageIcon, color: 'text-rose-700 bg-rose-50 border-rose-200', link: '/admin/media' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-800 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Vehicle Inspection CMS Dashboard
            </h1>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl font-medium">
              Real-time administrative control over products, solutions, industries, media assets, and customer enquiries.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products?openCreate=true"
              className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 font-bold rounded-xl shadow-md text-xs transition-all flex items-center gap-1.5"
            >
              + Create Product
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</span>
                <div className={`p-2.5 rounded-xl border group-hover:scale-110 transition-transform ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{card.count ?? 0}</div>
                <p className="text-xs text-slate-500 mt-1 font-medium">{card.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Recent Products</h2>
            </div>
            <Link to="/admin/products" className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3">Product Name</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-500">No products found.</td>
                  </tr>
                ) : (
                  recentProducts.map((prod) => (
                    <tr key={prod._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 truncate max-w-xs">{prod.name}</td>
                      <td className="px-5 py-3.5 text-slate-600">{prod.category?.name || 'Unassigned'}</td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{prod.productType}</td>
                      <td className="px-5 py-3.5">
                        <Badge status={prod.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white border border-slate-200 rounded-2xl flex flex-col shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Recent Enquiries</h2>
            </div>
            <Link to="/admin/enquiries" className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-5 space-y-4 flex-1">
            {recentEnquiries.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No enquiries submitted yet.</p>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq._id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{enq.name}</span>
                    <Badge status={enq.status} />
                  </div>
                  <p className="text-slate-600 line-clamp-2">{enq.message}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>{enq.email}</span>
                    <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
