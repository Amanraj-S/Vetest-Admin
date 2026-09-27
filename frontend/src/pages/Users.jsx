import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import { Users as UsersIcon, Plus, Edit, Trash2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    status: 'ACTIVE'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers();
      if (res.success) setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (u = null) => {
    if (u) {
      setSelectedUser(u);
      setFormData({
        name: u.name || '',
        email: u.email || '',
        password: '',
        role: u.role || 'ADMIN',
        status: u.status || 'ACTIVE'
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'ADMIN',
        status: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      setSubmitting(true);
      if (selectedUser) {
        await userService.updateUser(selectedUser._id, formData);
        toast.success('User updated successfully!');
      } else {
        await userService.createUser(formData);
        toast.success('User created successfully!');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admin user?')) return;
    try {
      await userService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UsersIcon className="w-7 h-7 text-cyan-600" />
            Admin User Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage administrative personnel, access roles (SUPER_ADMIN, ADMIN, EDITOR), and active status.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Admin User
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 font-mono text-[10px]">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="6" className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    No admin users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isProtected = u.role === 'SUPER_ADMIN' || u._id === currentUser?._id;
                  return (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={u.role} />
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={u.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(u)}
                            className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {isProtected ? (
                            <button
                              disabled
                              title={u.role === 'SUPER_ADMIN' ? 'Primary SUPER_ADMIN account cannot be deleted' : 'Cannot delete your active logged-in account'}
                              className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-300 cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDelete(u._id)}
                              className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Create User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={Boolean(selectedUser)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white disabled:opacity-50 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={selectedUser?.role === 'SUPER_ADMIN'}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 disabled:opacity-50"
              >
                {selectedUser?.role === 'SUPER_ADMIN' ? (
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                ) : (
                  <>
                    <option value="ADMIN">ADMIN</option>
                    <option value="EDITOR">EDITOR</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={selectedUser?.role === 'SUPER_ADMIN'}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 disabled:opacity-50"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              {selectedUser ? 'New Password (leave blank to keep current)' : 'Password *'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!selectedUser}
              placeholder={selectedUser ? '••••••••••••' : 'Enter password'}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
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
              {submitting ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
