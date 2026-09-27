import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { SettingsProvider } from './contexts/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Solutions from './pages/Solutions';
import Industries from './pages/Industries';
import Technology from './pages/Technology';
import Projects from './pages/Projects';
import Resources from './pages/Resources';
import Enquiries from './pages/Enquiries';
import Users from './pages/Users';
import Settings from './pages/Settings';

const App = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ToastProvider>
          <BrowserRouter>
          <Routes>
            {/* Public Login Route */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin CMS Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="solutions" element={<Solutions />} />
              <Route path="industries" element={<Industries />} />
              <Route path="technology" element={<Technology />} />
              <Route path="projects" element={<Projects />} />
              <Route path="resources" element={<Resources />} />
              <Route path="enquiries" element={<Enquiries />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Default Fallback Redirect */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </SettingsProvider>
  </AuthProvider>
  );
};

export default App;
