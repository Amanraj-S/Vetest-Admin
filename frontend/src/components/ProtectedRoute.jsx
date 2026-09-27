import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Verifying Vtest Admin Session...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-red-400">403</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
        <p className="text-slate-400 max-w-md mb-6">
          Your role (<span className="text-brand-400 font-semibold">{user.role}</span>) does not have sufficient permission to access this module.
        </p>
        <a href="/admin/dashboard" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all">
          Return to Dashboard
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
