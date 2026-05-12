'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { API_URL } from '.././endpoint/endpoint';
import MinimalSelect from '@/components/MinimalSelect';

const ClientsPage = () => {
  const { addToast } = useToast();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    country: '',
    state: ''
  });

  const [backendStats, setBackendStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const fetchClients = async (searchVal = search, statusVal = statusFilter, pageVal = page) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: pageVal, page_size: PAGE_SIZE });
      if (searchVal) params.set('search', searchVal);
      if (statusVal && statusVal !== 'All') params.set('status', statusVal);
      const res = await fetch(`${API_URL}/clients?${params}`, { credentials: 'include' });

      if (res.ok) {
        const data = await res.json();
        const clientsArray = data.clients || [];
        const transformedClients = clientsArray.map(client => ({
          id: client.id,
          clientName: client.name,
          name: client.name,
          email: client.email,
          phone: client.phone || '',
          company: client.company || '',
          address: client.address || '',
          country: client.country || '',
          state: client.state || '',
          status: client.status,
          joinDate: client.join_date ? new Date(client.join_date).toISOString().split('T')[0] : ''
        }));
        setClients(transformedClients);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
        if (data.active_count !== undefined) {
          setBackendStats({ total: data.total, active: data.active_count, inactive: data.inactive_count });
        }
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch clients');
      }
    } catch (err) {
      setError('Network error while fetching clients');
      console.error('Fetch clients error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(search, statusFilter, page);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchClients(search, statusFilter, 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleAddClient = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      joinDate: ''
    });
    setShowModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      address: client.address,
      country: client.country || '',
      state: client.state || '',
      status: client.status,
      joinDate: client.joinDate
    });
    setShowModal(true);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        const res = await fetch(`${API_URL}/clients/${clientToDelete.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (res.ok) {
          await fetchClients();
          setDeleteModal(false);
          setClientToDelete(null);
          addToast('Client deleted successfully', 'success');
        } else {
          const error = await res.json();
          addToast(error.error || 'Failed to delete client', 'error');
        }
      } catch (err) {
        addToast('Network error while deleting client', 'error');
        console.error('Delete client error:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let res;
      if (editingClient) {
        // Update existing client
        res = await fetch(`${API_URL}/clients/${editingClient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            address: formData.address,
            country: formData.country,
            state: formData.state,
            status: formData.status,
            join_date: formData.joinDate || null
          })
        });
      } else {
        // Create new client
        res = await fetch(`${API_URL}/clients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            address: formData.address,
            country: formData.country,
            state: formData.state,
            join_date: formData.joinDate || null
          })
        });
      }

      if (res.ok) {
        // Refresh the clients list
        await fetchClients();
        setShowModal(false);
        setEditingClient(null);
        addToast(editingClient ? 'Client updated successfully' : 'Client created successfully', 'success');
      } else {
        const error = await res.json();
        addToast(error.error || 'Failed to save client', 'error');
      }
    } catch (err) {
      addToast('Network error while saving client', 'error');
      console.error('Save client error:', err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Use statistics from backend
  const stats = backendStats;

  const [deleteModal, setDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Clients</h1>
        </div>
        <button
          onClick={handleAddClient}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Client
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-4-4h-4"/>
                <circle cx="17" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <p className="text-xl font-bold text-gray-900 m-0">{stats.total}</p>
          <p className="text-xs text-gray-400 mt-1 m-0">Total Clients</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
          </div>
          <p className="text-xl font-bold text-gray-900 m-0">{stats.active}</p>
          <p className="text-xs text-gray-400 mt-1 m-0">Active</p>
        </div>
        
                
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
          </div>
          <p className="text-xl font-bold text-gray-900 m-0">{stats.inactive}</p>
          <p className="text-xs text-gray-400 mt-1 m-0">Inactive</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <MinimalSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} wrapperClassName="max-w-[160px]">
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </MinimalSelect>
          <span className="text-xs text-gray-400 whitespace-nowrap">{total} found</span>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">State</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={10} className="px-5 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-primary" />
                    Loading clients...
                  </div>
                </td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan={10} className="px-5 py-8 text-center text-gray-500">No clients found</td></tr>
              ) : clients.map((client, index) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-800">{(page - 1) * PAGE_SIZE + index + 1}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-800">{client.name}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{client.email}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{client.phone}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{client.company}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">{client.address}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{client.country || ''}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{client.state || ''}</td>
                                    <td className="px-5 py-4 text-sm text-gray-600">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClient(client)}
                        className="text-primary hover:text-primary-dark border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(client)}
                        className="text-red-600 hover:text-red-700 border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min((page - 1) * PAGE_SIZE + PAGE_SIZE, total)} of {total} clients
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter client name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Enter address"
                  rows="3"
                />
              </div>

              {editingClient && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <MinimalSelect
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </MinimalSelect>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <MinimalSelect
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">UK</option>
                  </MinimalSelect>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <MinimalSelect
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  >
                    <option value="">Select State</option>
                    {formData.country === 'India' && (
                      <>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                      </>
                    )}
                    {formData.country === 'USA' && (
                      <>
                        <option value="Alabama">Alabama</option>
                        <option value="Alaska">Alaska</option>
                        <option value="Arizona">Arizona</option>
                        <option value="Arkansas">Arkansas</option>
                        <option value="California">California</option>
                        <option value="Colorado">Colorado</option>
                        <option value="Connecticut">Connecticut</option>
                        <option value="Delaware">Delaware</option>
                        <option value="Florida">Florida</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Hawaii">Hawaii</option>
                        <option value="Idaho">Idaho</option>
                        <option value="Illinois">Illinois</option>
                        <option value="Indiana">Indiana</option>
                        <option value="Iowa">Iowa</option>
                        <option value="Kansas">Kansas</option>
                        <option value="Kentucky">Kentucky</option>
                        <option value="Louisiana">Louisiana</option>
                        <option value="Maine">Maine</option>
                        <option value="Maryland">Maryland</option>
                        <option value="Massachusetts">Massachusetts</option>
                        <option value="Michigan">Michigan</option>
                        <option value="Minnesota">Minnesota</option>
                        <option value="Mississippi">Mississippi</option>
                        <option value="Missouri">Missouri</option>
                        <option value="Montana">Montana</option>
                        <option value="Nebraska">Nebraska</option>
                        <option value="Nevada">Nevada</option>
                        <option value="New Hampshire">New Hampshire</option>
                        <option value="New Jersey">New Jersey</option>
                        <option value="New Mexico">New Mexico</option>
                        <option value="New York">New York</option>
                        <option value="North Carolina">North Carolina</option>
                        <option value="North Dakota">North Dakota</option>
                        <option value="Ohio">Ohio</option>
                        <option value="Oklahoma">Oklahoma</option>
                        <option value="Oregon">Oregon</option>
                        <option value="Pennsylvania">Pennsylvania</option>
                        <option value="Rhode Island">Rhode Island</option>
                        <option value="South Carolina">South Carolina</option>
                        <option value="South Dakota">South Dakota</option>
                        <option value="Tennessee">Tennessee</option>
                        <option value="Texas">Texas</option>
                        <option value="Utah">Utah</option>
                        <option value="Vermont">Vermont</option>
                        <option value="Virginia">Virginia</option>
                        <option value="Washington">Washington</option>
                        <option value="West Virginia">West Virginia</option>
                        <option value="Wisconsin">Wisconsin</option>
                        <option value="Wyoming">Wyoming</option>
                      </>
                    )}
                    {formData.country === 'Australia' && (
                      <>
                        <option value="Australian Capital Territory">Australian Capital Territory</option>
                        <option value="New South Wales">New South Wales</option>
                        <option value="Northern Territory">Northern Territory</option>
                        <option value="Queensland">Queensland</option>
                        <option value="South Australia">South Australia</option>
                        <option value="Tasmania">Tasmania</option>
                        <option value="Victoria">Victoria</option>
                        <option value="Western Australia">Western Australia</option>
                      </>
                    )}
                    {formData.country === 'Canada' && (
                      <>
                        <option value="Alberta">Alberta</option>
                        <option value="British Columbia">British Columbia</option>
                        <option value="Manitoba">Manitoba</option>
                        <option value="New Brunswick">New Brunswick</option>
                        <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                        <option value="Northwest Territories">Northwest Territories</option>
                        <option value="Nova Scotia">Nova Scotia</option>
                        <option value="Nunavut">Nunavut</option>
                        <option value="Ontario">Ontario</option>
                        <option value="Prince Edward Island">Prince Edward Island</option>
                        <option value="Quebec">Quebec</option>
                        <option value="Saskatchewan">Saskatchewan</option>
                        <option value="Yukon">Yukon</option>
                      </>
                    )}
                    {formData.country === 'UK' && (
                      <>
                        <option value="England">England</option>
                        <option value="Scotland">Scotland</option>
                        <option value="Wales">Wales</option>
                        <option value="Northern Ireland">Northern Ireland</option>
                      </>
                    )}
                  </MinimalSelect>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <input
                  type="date"
                  required
                  value={formData.joinDate}
                  onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-0 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors border-0 cursor-pointer"
                >
                  {editingClient ? 'Update Client' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Client</h3>
                <p className="text-sm text-gray-600">Are you sure you want to delete this client?</p>
              </div>
            </div>
            
            {clientToDelete && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{clientToDelete.name}</p>
                <p className="text-xs text-gray-600 mt-1">{clientToDelete.email}</p>
              </div>
            )}
            
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setClientToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-0 cursor-pointer"
              >
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
