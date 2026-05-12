'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/ToastContext';
import { useAuth } from '../components/AuthContext';
import { API_URL } from '../endpoint/endpoint';

export default function AdminPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    loginEmail: '',
    password: '',
    role: 'admin',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [currentUser]);

  const fetchAdmins = async (searchVal = searchTerm, pageVal = page) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: pageVal, page_size: PAGE_SIZE });
      if (searchVal) params.set('search', searchVal);
      const res = await fetch(`${API_URL}/admins?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } else {
        console.error('Failed to fetch admins');
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(searchTerm, page);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchAdmins(searchTerm, 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const openModal = () => {
    setEditMode(false);
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      loginEmail: '',
      password: '',
      role: 'admin',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditMode(true);
    setEditingUserId(user.id);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      loginEmail: user.login_email || '',
      password: '', // Never pre-fill password
      role: user.role || 'admin',
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`${API_URL}/users/${userToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        await fetchAdmins();
        closeDeleteModal();
        addToast('Admin deleted successfully', 'success');
      } else {
        const err = await res.json();
        addToast(err.error || 'Failed to delete admin', 'error');
      }
    } catch {
      addToast('Network error while deleting admin', 'error');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowPassword(false);
    setEditMode(false);
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      loginEmail: '',
      password: '',
      role: 'admin',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitized = name === 'name' ? value.replace(/[^a-zA-Z\s\-'.]/g, '') : value;
    setFormData(prev => ({ ...prev, [name]: sanitized }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Validate password for new users
      if (!editMode && formData.password.length < 6) {
        addToast('Password must be at least 6 characters', 'error');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        login_email: formData.loginEmail,
        role: formData.role,
      };

      if (editMode) {
        const res = await fetch(`${API_URL}/users/${editingUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchAdmins();
          closeModal();
          addToast('Admin updated successfully', 'success');
        } else {
          const err = await res.json();
          addToast(err.error || 'Failed to update admin', 'error');
        }
      } else {
        const res = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...payload, password: formData.password }),
        });
        if (res.ok) {
          await fetchAdmins();
          closeModal();
          addToast('Admin created successfully', 'success');
        } else {
          const err = await res.json();
          addToast(err.error || 'Failed to create admin', 'error');
        }
      }
    } catch {
      addToast('Network error while saving admin', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm";

  // Show loading or redirect if not admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary mx-auto" />
          <p className="text-sm text-gray-500 mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 m-0">Admin Management</h1>
        <p className="text-sm text-gray-400 mt-1 mb-0">Manage admin users and their permissions.</p>
      </div>

      {/* Search and Add */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <button onClick={openModal} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer whitespace-nowrap">
            Add Admin
          </button>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800 m-0">All Admins</h2>
          <span className="text-xs text-gray-400">{total} found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['S.No', 'Name', 'Email', 'Login Email', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-primary" />
                    Loading admins...
                  </div>
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-500">No admins found</td></tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-600 text-center">{(page - 1) * PAGE_SIZE + index + 1}</td>
                    <td className="px-3 py-2 text-center">
                      <span className="text-sm font-medium text-gray-800">{user.name}</span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-600 text-center">{user.email}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 text-center">{user.login_email}</td>
                    <td className="px-3 py-2 text-sm text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <button onClick={() => openEditModal(user)} className="text-primary hover:text-primary-dark border-0 bg-transparent cursor-pointer p-1.5 rounded hover:bg-gray-50" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        {user.id !== currentUser.id && (
                          <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:text-red-700 border-0 bg-transparent cursor-pointer p-1.5 rounded hover:bg-gray-50" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min((page - 1) * PAGE_SIZE + PAGE_SIZE, total)} of {total} admins
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white cursor-pointer text-gray-600"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) => p === '…' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-sm rounded-lg transition-colors border-0 cursor-pointer ${
                      page === p ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 bg-transparent'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white cursor-pointer text-gray-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 m-0">{editMode ? 'Edit Admin' : 'Add New Admin'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none border-0 bg-transparent cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className={inputCls} placeholder="Enter full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={inputCls} placeholder="admin@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Login Email</label>
                  <input type="email" name="loginEmail" value={formData.loginEmail} onChange={handleInputChange} required className={inputCls} placeholder="login@company.com" />
                </div>
                {!editMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required className={inputCls + ' pr-10'} placeholder="Enter password (min 6 chars)" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 border-0 bg-transparent cursor-pointer">
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={closeModal} disabled={isSubmitting} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm border-0 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                  {editMode ? 'Update Admin' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Admin</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={closeDeleteModal} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm border-0">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
