import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Lightbulb,
  Building2,
  Cpu,
  Briefcase,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import Badge from '../components/Badge';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { logoUrl, settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Solutions', path: '/admin/solutions', icon: Lightbulb },
    { name: 'Industries', path: '/admin/industries', icon: Building2 },
    { name: 'Technology', path: '/admin/technology', icon: Cpu },
    { name: 'Projects / Cases', path: '/admin/projects', icon: Briefcase },
    { name: 'Resources', path: '/admin/resources', icon: FileText },
    { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'Admin Users', path: '/admin/users', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const currentPath = location.pathname.split('/').filter(Boolean);
  const breadcrumbText = currentPath.length > 1
    ? currentPath[1].charAt(0).toUpperCase() + currentPath[1].slice(1)
    : 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center">
            <img
              src={logoUrl}
              alt={settings?.general?.siteName || 'Vtest Logo'}
              className="h-12 max-w-[180px] w-auto object-contain"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Management Modules
          </div>

          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-emerald-800 text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'Admin User'}</p>
              <div className="mt-0.5">
                <Badge status={user?.role || 'ADMIN'}>{user?.role}</Badge>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 px-6 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-400">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-900 capitalize">{breadcrumbText}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              Logout
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
