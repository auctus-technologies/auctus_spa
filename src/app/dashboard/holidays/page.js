'use client';

import { useState, useEffect, useMemo } from 'react';
import { useToast } from '../components/ToastContext';
import { API_URL } from '../endpoint/endpoint';

const HolidaysPage = () => {
  const { addToast } = useToast();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [formData, setFormData] = useState({ name: '', date: '' });
  const [deleteModal, setDeleteModal] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/holidays`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setHolidays(data.holidays || []);
      } else {
        addToast('Failed to fetch holidays', 'error');
      }
    } catch {
      addToast('Network error while fetching holidays', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return holidays;
    const q = search.toLowerCase();
    return holidays.filter(h => h.name.toLowerCase().includes(q));
  }, [holidays, search]);

  const handleAdd = () => {
    setEditingHoliday(null);
    setFormData({ name: '', date: '' });
    setShowModal(true);
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({ name: holiday.name, date: holiday.date });
    setShowModal(true);
  };

  const handleDeleteClick = (holiday) => {
    setHolidayToDelete(holiday);
    setDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingHoliday
        ? `${API_URL}/holidays/${editingHoliday.id}`
        : `${API_URL}/holidays`;
      const method = editingHoliday ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, date: formData.date }),
      });

      if (res.ok) {
        addToast(editingHoliday ? 'Holiday updated' : 'Holiday added', 'success');
        setShowModal(false);
        fetchHolidays();
      } else {
        const err = await res.json();
        addToast(err.detail?.[0]?.msg || err.error || 'Failed to save holiday', 'error');
      }
    } catch {
      addToast('Network error while saving holiday', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!holidayToDelete) return;
    try {
      const res = await fetch(`${API_URL}/holidays/${holidayToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        addToast('Holiday deleted', 'success');
        fetchHolidays();
      } else {
        const err = await res.json();
        addToast(err.error || 'Failed to delete holiday', 'error');
      }
    } catch {
      addToast('Network error while deleting holiday', 'error');
    } finally {
      setDeleteModal(false);
      setHolidayToDelete(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Holidays</h1>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Holiday
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search holidays..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary hover:border-gray-300 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 shrink-0">
            {filtered.length} holiday{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Holidays Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Holiday Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-primary"/>
                      Loading holidays…
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
                    {search ? 'No holidays match your search.' : 'No holidays added yet.'}
                  </td>
                </tr>
              ) : filtered.map((holiday, index) => (
                <tr key={holiday.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-800">{index + 1}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-800">{holiday.name}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{formatDate(holiday.date)}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(holiday)}
                        className="text-primary hover:text-primary-dark border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(holiday)}
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
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. Christmas Day"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                  disabled={submitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors border-0 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : editingHoliday ? 'Update Holiday' : 'Create Holiday'}
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Holiday</h3>
                <p className="text-sm text-gray-600">Are you sure you want to delete this holiday?</p>
              </div>
            </div>

            {holidayToDelete && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{holidayToDelete.name}</p>
                <p className="text-xs text-gray-600 mt-1">{formatDate(holidayToDelete.date)}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => { setDeleteModal(false); setHolidayToDelete(null); }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-0 cursor-pointer"
              >
                Delete Holiday
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidaysPage;
