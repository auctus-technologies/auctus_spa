'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/dashboard/components/AuthContext';
import MinimalSelect from '@/components/MinimalSelect';
import FileViewerModal from '@/app/dashboard/components/FileViewerModal';
import { getLeaveTypes } from '@/lib/api';
import { API_URL } from '../endpoint/endpoint';

const DEFAULT_LEAVE_TYPES = [
  { value: 'sick_leave',        label: 'Sick Leave' },
  { value: 'casual_leave',      label: 'Casual Leave' },
  { value: 'maternity_leave',   label: 'Maternity Leave' },
  { value: 'medical_leave',     label: 'Medical Leave' },
  { value: 'condolences_leave', label: 'Condolences Leave' },
];

const STATUS_COLOR = {
  approved: 'bg-green-100 text-green-700',
  pending:  'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

const EMPTY_FORM = { leave_type: 'sick_leave', start_date: '', end_date: '', reason: '', documents: [] };

export default function ApplicationsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const [leaveRequests, setLeaveRequests]             = useState([]);
  const [loading, setLoading]                         = useState(true);
  const [error, setError]                             = useState(null);

  const [showForm, setShowForm]                       = useState(false);
  const [formData, setFormData]                       = useState(EMPTY_FORM);
  const [submitting, setSubmitting]                   = useState(false);
  const [formError, setFormError]                     = useState(null);

  const [leaveTypes, setLeaveTypes]                   = useState(DEFAULT_LEAVE_TYPES);

  const [previewDoc, setPreviewDoc]                   = useState(null);
  const [previewLeave, setPreviewLeave]               = useState(null);

  // ── Fetch Leave Types ────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchLeaveTypes() {
      try {
        const data = await getLeaveTypes();
        if (data.leave_types) {
          setLeaveTypes(data.leave_types);
        }
      } catch (e) {
        console.error('Failed to fetch leave types:', e);
        // Keep using default leave types on error
      }
    }
    fetchLeaveTypes();
  }, []);

  const leaveLabel = Object.fromEntries(leaveTypes.map(t => [t.value, t.label]));

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/leave-requests`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch leave requests');
      setLeaveRequests(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  // ── Form helpers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const body = new FormData();
    body.append('leave_type', formData.leave_type);
    body.append('start_date', formData.start_date);
    body.append('end_date',   formData.end_date);
    body.append('reason',     formData.reason);
    formData.documents.forEach((doc) => body.append('documents', doc));

    try {
      const res = await fetch(`${API_URL}/leave-requests`, { method: 'POST', credentials: 'include', body });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.detail || 'Failed to save leave request');
      }

      const saved = await res.json();
      setLeaveRequests(prev => [saved, ...prev]);
      setShowForm(false);
      setFormData(EMPTY_FORM);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Admin actions ─────────────────────────────────────────────────────────
  const handleStatusChange = async (id, action) => {
    try {
      const res = await fetch(`${API_URL}/leave-requests/${id}/${action}`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setLeaveRequests(prev => prev.map(l => l.id === id ? updated : l));
    } catch {
      alert(`Failed to ${action} leave request`);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Leave Requests</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Leave Requests</h2>
            {!isAdmin && (
              <button
                onClick={openAdd}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm"
              >
                Apply for Leave
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-gray-500">Loading…</div>
          ) : error ? (
            <div className="py-16 text-center text-sm text-red-500">{error}</div>
          ) : leaveRequests.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">No leave requests found.</div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee ID</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave Type</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Documents</th>
                      {isAdmin && <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leaveRequests.map((req, idx) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 text-sm font-medium text-gray-800">{idx + 1}</td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-800">{req.employee_id || '-'}</td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-800">{req.user_name}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{leaveLabel[req.leave_type] ?? req.leave_type}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{req.start_date}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{req.end_date}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{req.applied_date}</td>
                        <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">{req.reason}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[req.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {req.documents && req.documents.length > 0 ? (
                            <div className="space-y-2">
                              {req.documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    <div className="min-w-0">
                                      <p className="text-sm text-gray-800 truncate max-w-[150px]">{doc.file_url.split('/').pop()}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={() => { setPreviewDoc(doc); setPreviewLeave(req); }}
                                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                                      title="Preview"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                      </svg>
                                    </button>
                                    <button
                                      onClick={async () => {
                                        const url = `${API_URL.replace('/api', '')}${doc.file_url}`;
                                        try {
                                          const response = await fetch(url, { credentials: 'include' });
                                          if (response.ok) {
                                            const blob = await response.blob();
                                            const downloadUrl = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = downloadUrl;
                                            a.download = doc.file_url.split('/').pop();
                                            document.body.appendChild(a);
                                            a.click();
                                            window.URL.revokeObjectURL(downloadUrl);
                                            document.body.removeChild(a);
                                          }
                                        } catch (err) {
                                          console.error('Download failed:', err);
                                        }
                                      }}
                                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                                      title="Download"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="px-5 py-4">
                            {req.status === 'pending' ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleStatusChange(req.id, 'approve')}
                                  className="text-xs px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusChange(req.id, 'reject')}
                                  className="text-xs px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      <FileViewerModal
        isOpen={!!previewDoc}
        onClose={() => { setPreviewDoc(null); setPreviewLeave(null); }}
        attachment={previewDoc ? {
          id: previewDoc.id,
          file_name: previewDoc.file_url.split('/').pop(),
          name: previewDoc.file_url.split('/').pop(),
          file_size: null,
          size: null,
          uploaded_at: previewDoc.uploaded_at,
        } : null}
        projectId={previewLeave?.id || 0}
        fileUrl={previewDoc ? `${API_URL.replace('/api', '')}${previewDoc.file_url}` : null}
      />

      {/* Apply Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Apply for Leave</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>
              )}

              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <MinimalSelect
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value, document: null })}
                  required
                >
                  {leaveTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </MinimalSelect>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    min={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>

              {/* Documents — for any leave type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Documents {formData.leave_type === 'medical_leave' && <span className="text-red-500">*</span>}
                </label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors bg-gray-50/50"
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary'); }}
                  onDragLeave={(e) => { e.currentTarget.classList.remove('border-primary'); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-primary');
                    const files = Array.from(e.dataTransfer.files);
                    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
                  }}
                >
                  <input
                    type="file"
                    id="leave-docs"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                  <label htmlFor="leave-docs" className="cursor-pointer block">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="text-primary font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</p>
                  </label>
                </div>

                {formData.documents.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</p>
                    <div className="space-y-2">
                      {formData.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <div className="min-w-0">
                              <p className="text-sm text-gray-800 truncate">{doc.name}</p>
                              <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              documents: prev.documents.filter((_, i) => i !== idx)
                            }))}
                            className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                            title="Remove file"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
