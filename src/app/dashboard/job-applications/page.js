'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '../components/ToastContext';
import { API_URL, BASE_URL } from '../endpoint/endpoint';
import MinimalSelect from '@/components/MinimalSelect';
import FileViewerModal from '@/app/dashboard/components/FileViewerModal';

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  cls: 'bg-yellow-50 text-yellow-700' },
  approved: { label: 'Approved', cls: 'bg-green-50  text-green-700'  },
  rejected: { label: 'Rejected', cls: 'bg-red-50    text-red-700'    },
  on_hold:  { label: 'On Hold',  cls: 'bg-blue-50   text-blue-700'   },
};

const STATUS_OPTIONS = [
  { value: 'pending',  label: 'Pending'  },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'on_hold',  label: 'On Hold'  },
];

function TableStatusSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0, width: 0 });
  const btnRef          = useRef(null);

  const current = STATUS_CONFIG[value] || { label: value, cls: 'bg-gray-100 text-gray-600' };

  const openMenu = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!btnRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={openMenu}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer transition-colors ${current.cls}`}
      >
        {current.label}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          style={{ position: 'absolute', top: pos.top, left: pos.left, minWidth: Math.max(pos.width, 140), zIndex: 9999 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {STATUS_OPTIONS.map(opt => {
            const cfg = STATUS_CONFIG[opt.value];
            return (
              <button
                key={opt.value}
                type="button"
                onMouseDown={e => e.stopPropagation()}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${opt.value === value ? 'font-semibold' : 'text-gray-700'}`}
              >
                <span className={`inline-block w-2 h-2 rounded-full ${cfg?.cls.split(' ')[0]}`} />
                {opt.label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}

export default function JobApplicationsPage() {
  const { addToast } = useToast();

  const [applications,  setApplications]  = useState([]);
  const [openings,      setOpenings]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState('All');
  const [openingFilter, setOpeningFilter] = useState('All');
  const [page,          setPage]          = useState(1);
  const [total,         setTotal]         = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);
  const [previewResume, setPreviewResume] = useState(null);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, statusFilter, openingFilter]);

  // Fetch openings for filter dropdown
  useEffect(() => {
    fetch(`${API_URL}/openings?page_size=100`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setOpenings(d.openings || []); })
      .catch(() => {});
  }, []);

  // Fetch applications with debounce on search
  useEffect(() => {
    const timer = setTimeout(() => fetchApplications(), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, statusFilter, openingFilter, page]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)                            params.set('search',     search);
      if (statusFilter  && statusFilter  !== 'All') params.set('status',     statusFilter);
      if (openingFilter && openingFilter !== 'All') params.set('opening_id', openingFilter);
      params.set('page',      page);
      params.set('page_size', PAGE_SIZE);

      const res = await fetch(`${API_URL}/applications?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setApplications(data.applications || []);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 1);
    } catch {
      addToast('Failed to fetch applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setApplications(prev => prev.map(a => a.id === id ? updated : a));
      addToast('Status updated', 'success');
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDownload = async (resumeUrl, name) => {
    try {
      const url = resumeUrl.startsWith('http') ? resumeUrl : `${BASE_URL}${resumeUrl}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) return;
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = name || 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    } catch {
      addToast('Download failed', 'error');
    }
  };

  const indexOfFirst = (page - 1) * PAGE_SIZE;

  return (
    <>
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 m-0">Job Applications</h1>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">

            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search name, email, phone…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary hover:border-gray-300 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Status filter */}
            <MinimalSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)} wrapperClassName="w-40">
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="on_hold">On Hold</option>
            </MinimalSelect>

            {/* Opening filter */}
            <MinimalSelect value={openingFilter} onChange={e => setOpeningFilter(e.target.value)} wrapperClassName="w-48">
              <option value="All">All Openings</option>
              {openings.map(o => (
                <option key={o.id} value={o.id}>
                  {o.job_title.replace(/\b\w/g, c => c.toUpperCase())}
                </option>
              ))}
            </MinimalSelect>

          </div>
          <p className="text-xs text-gray-400 shrink-0">{total} applicant{total !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['S.No', 'Name', 'Email', 'Phone', 'City', 'Experience', 'Applied For', 'Resume', 'Applied On', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-primary"/>
                      Loading applications…
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-sm text-gray-400">
                    {search || statusFilter !== 'All' || openingFilter !== 'All'
                      ? 'No applications match your filters.'
                      : 'No applications yet.'}
                  </td>
                </tr>
              ) : applications.map((app, idx) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-5 py-4 text-sm font-medium text-gray-800">
                    {indexOfFirst + idx + 1}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                    {app.full_name}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {app.email}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {app.phone || '—'}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {app.city || '—'}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {app.experience != null ? `${app.experience} yr${app.experience !== 1 ? 's' : ''}` : '—'}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700 max-w-[160px]">
                    <span className="truncate block" title={app.opening_title}>
                      {app.opening_title || <span className="text-gray-400">—</span>}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {app.resume ? (
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          <span className="text-xs text-gray-600 truncate max-w-[90px]">{app.resume.split('/').pop()}</span>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0 ml-1">
                          <button
                            onClick={() => setPreviewResume(app)}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors border-0 bg-transparent cursor-pointer"
                            title="Preview"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDownload(app.resume, `${app.full_name}_resume.pdf`)}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors border-0 bg-transparent cursor-pointer"
                            title="Download"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(app.applied_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>

                  <td className="px-5 py-4">
                    <TableStatusSelect
                      value={app.status}
                      onChange={newStatus => handleStatusChange(app.id, newStatus)}
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {total === 0 ? 0 : indexOfFirst + 1}–{Math.min(indexOfFirst + PAGE_SIZE, total)} of {total} applications
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
                  <span key={`e-${i}`} className="px-2 text-gray-400 text-sm">…</span>
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

    </div>

    <FileViewerModal
      isOpen={!!previewResume}
      onClose={() => setPreviewResume(null)}
      attachment={previewResume ? {
        id: previewResume.id,
        file_name: previewResume.resume.split('/').pop(),
        name:      previewResume.resume.split('/').pop(),
        uploaded_at: previewResume.applied_at,
      } : null}
      projectId={0}
      fileUrl={previewResume
        ? (previewResume.resume.startsWith('http') ? previewResume.resume : `${BASE_URL}${previewResume.resume}`)
        : null}
    />
    </>
  );
}
