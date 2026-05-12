'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/ToastContext';
import { API_URL } from '../endpoint/endpoint';
import MinimalSelect from '@/components/MinimalSelect';

const STATES_BY_COUNTRY = {
  India: ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'],
  USA: ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
  Australia: ['Australian Capital Territory','New South Wales','Northern Territory','Queensland','South Australia','Tasmania','Victoria','Western Australia'],
  Canada: ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Northwest Territories','Nova Scotia','Nunavut','Ontario','Prince Edward Island','Quebec','Saskatchewan','Yukon'],
  UK: ['England','Scotland','Wales','Northern Ireland'],
};

const STATUS_CONFIG = {
  proposal:      { label: 'Proposal',      cls: 'bg-amber-100 text-amber-700' },
  sent:          { label: 'Sent',           cls: 'bg-blue-100 text-blue-700' },
  processing:    { label: 'Processing',     cls: 'bg-purple-100 text-purple-700' },
  client:        { label: 'Client',         cls: 'bg-green-100 text-green-700' },
  lost:          { label: 'Lost',           cls: 'bg-red-100 text-red-700' },
  not_interested:{ label: 'Not Interested', cls: 'bg-gray-100 text-gray-600' },
};

const LEAD_FROM_LABELS = {
  instagram: 'Instagram', facebook: 'Facebook', whatsapp: 'WhatsApp',
  meta_ads: 'Meta Ads', linkedin: 'LinkedIn', email: 'Email',
  website: 'Website', referral: 'Referral', youtube: 'YouTube',
  twitter: 'Twitter', other: 'Other',
};

const EMPTY_FORM = {
  client_name: '', company_name: '', email: '', phone: '',
  address: '', country: '', state: '',
  status: '', lead_from: '', lead_date: '',
};

const LeadsPage = () => {
  const router = useRouter();
  const { addToast } = useToast();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [leadFromFilter, setLeadFromFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [convertTarget, setConvertTarget] = useState(null);
  const [converting, setConverting] = useState(false);

  useEffect(() => { setPage(1); }, [search, statusFilter, leadFromFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads(search, statusFilter, leadFromFilter, page);
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, statusFilter, leadFromFilter, page]);

  const fetchLeads = async (searchVal = '', statusVal = 'All', leadFromVal = 'All', pageVal = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchVal) params.set('search', searchVal);
      if (statusVal && statusVal !== 'All') params.set('status', statusVal);
      if (leadFromVal && leadFromVal !== 'All') params.set('lead_from', leadFromVal);
      params.set('page', pageVal);
      params.set('page_size', PAGE_SIZE);

      const res = await fetch(`${API_URL}/leads?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } else {
        addToast('Failed to fetch leads', 'error');
      }
    } catch {
      addToast('Network error while fetching leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingLead(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      client_name: lead.client_name || '',
      company_name: lead.company_name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      address: lead.address || '',
      country: lead.country || '',
      state: lead.state || '',
      status: lead.status || '',
      lead_from: lead.lead_from || '',
      lead_date: lead.lead_date || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSaving(true);
    try {
      const body = {
        client_name: formData.client_name,
        company_name: formData.company_name || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        country: formData.country || null,
        state: formData.state || null,
        status: formData.status || null,
        lead_from: formData.lead_from || null,
        lead_date: formData.lead_date || null,
      };

      const url = editingLead ? `${API_URL}/leads/${editingLead.id}` : `${API_URL}/leads`;
      const method = editingLead ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        addToast(editingLead ? 'Lead updated successfully' : 'Lead added successfully', 'success');
        setShowModal(false);
        fetchLeads(search, statusFilter, leadFromFilter, page);
      } else {
        const err = await res.json();
        addToast(err.detail || err.error || 'Failed to save lead', 'error');
      }
    } catch {
      addToast('Network error while saving lead', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/leads/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        addToast('Lead deleted successfully', 'success');
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
        fetchLeads(search, statusFilter, leadFromFilter, page);
      } else {
        addToast('Failed to delete lead', 'error');
      }
    } catch {
      addToast('Network error while deleting lead', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const confirmConvert = async () => {
    if (!convertTarget) return;
    setConverting(true);
    try {
      const res = await fetch(`${API_URL}/leads/${convertTarget.id}/convert-to-client`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        addToast(`${convertTarget.client_name} converted to client`, 'success');
        setShowConvertConfirm(false);
        setConvertTarget(null);
        fetchLeads(search, statusFilter, leadFromFilter, page);
      } else {
        const err = await res.json();
        addToast(err.detail || err.error || 'Failed to convert lead', 'error');
      }
    } catch {
      addToast('Network error while converting lead', 'error');
    } finally {
      setConverting(false);
    }
  };

  const f = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let sanitized = value;
    if (name === 'client_name') {
      sanitized = value.replace(/[^a-zA-Z\s\-'.]/g, '');
    } else if (name === 'phone') {
      sanitized = value.replace(/[^\d\s\-+().]/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: sanitized }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.client_name.trim()) errors.client_name = 'Client name is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Enter a valid email address';
    return errors;
  };

  const validateField = (name) => {
    const errors = {};
    if (name === 'client_name' && !formData.client_name.trim())
      errors.client_name = 'Client name is required';
    if (name === 'email' && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Enter a valid email address';
    return errors;
  };

  const handleBlur = (e) => {
    const errs = validateField(e.target.name);
    setFormErrors(prev => ({ ...prev, ...errs }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Lead Management</h1>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Lead
        </button>
      </div>

      {/* Search / Filter Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search by name, company or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
            <MinimalSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} wrapperClassName="w-44">
              <option value="All">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </MinimalSelect>
            <MinimalSelect value={leadFromFilter} onChange={(e) => setLeadFromFilter(e.target.value)} wrapperClassName="w-44">
              <option value="All">All Sources</option>
              {Object.entries(LEAD_FROM_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </MinimalSelect>
          </div>
          <p className="text-xs text-gray-400 shrink-0">{total} lead{total !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Client Name</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Source</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Lead Date</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={9} className="px-5 py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-primary"/>
                    Loading leads…
                  </div>
                </td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">
                  {search || statusFilter !== 'All' || leadFromFilter !== 'All' ? 'No leads match your filters.' : 'No leads yet.'}
                </td></tr>
              ) : leads.map((lead, idx) => {
                const statusCfg = STATUS_CONFIG[lead.status];
                return (
                  <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/dashboard/leads/${lead.id}`)}>
                    <td className="px-5 py-4 text-center">
                      <div className="text-sm font-medium text-gray-800">{(page - 1) * PAGE_SIZE + idx + 1}</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="text-sm font-medium text-gray-800">{lead.client_name}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 text-center">{lead.company_name || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 text-center">{lead.email || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 text-center">{lead.phone || '—'}</td>
                    <td className="px-5 py-4 text-center">
                      {statusCfg ? (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusCfg.cls}`}>
                          {statusCfg.label}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 text-center">
                      {lead.lead_from ? LEAD_FROM_LABELS[lead.lead_from] || lead.lead_from : '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 text-center">{lead.lead_date || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/leads/${lead.id}`); }}
                          className="text-blue-600 hover:text-blue-700 border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(lead); }}
                          className="text-primary hover:text-primary-dark border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        {lead.status !== 'client' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setConvertTarget(lead); setShowConvertConfirm(true); }}
                            className="text-green-600 hover:text-green-700 border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors"
                            title="Convert to Client"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(lead); setShowDeleteConfirm(true); }}
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} leads
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingLead ? 'Edit Lead' : 'Add Lead'}
              </h2>
              <button
                type="button"
                onClick={() => { setShowModal(false); setFormErrors({}); }}
                className="text-gray-400 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${formErrors.client_name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'}`}
                    placeholder="Full name"
                  />
                  {formErrors.client_name && <p className="mt-1 text-xs text-red-500">{formErrors.client_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={f('company_name')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={f('email')}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${formErrors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'}`}
                    placeholder="email@example.com"
                  />
                  {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+1 555-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <MinimalSelect
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value, state: '' }))}
                  >
                    <option value="">Select Country</option>
                    {Object.keys(STATES_BY_COUNTRY).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </MinimalSelect>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <MinimalSelect
                    value={formData.state}
                    onChange={f('state')}
                    disabled={!formData.country || !STATES_BY_COUNTRY[formData.country]}
                  >
                    <option value="">Select State</option>
                    {(STATES_BY_COUNTRY[formData.country] || []).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </MinimalSelect>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <MinimalSelect value={formData.status} onChange={f('status')}>
                    <option value="">— Select Status —</option>
                    {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </MinimalSelect>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead From</label>
                  <MinimalSelect value={formData.lead_from} onChange={f('lead_from')}>
                    <option value="">— Select Source —</option>
                    {Object.entries(LEAD_FROM_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </MinimalSelect>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Date</label>
                  <input
                    type="date"
                    value={formData.lead_date}
                    onChange={f('lead_date')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={f('address')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Full address..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingLead ? 'Update Lead' : 'Add Lead'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormErrors({}); }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Lead</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-medium">{deleteTarget?.client_name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteTarget(null); }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Client Confirmation Modal */}
      {showConvertConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Convert to Client</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Convert <span className="font-medium">{convertTarget?.client_name}</span>
                {convertTarget?.company_name ? ` from ${convertTarget.company_name}` : ''} to a client?
                A client record will be created and the lead status will be set to <span className="font-medium">Client</span>.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowConvertConfirm(false); setConvertTarget(null); }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmConvert}
                  disabled={converting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-60"
                >
                  {converting ? 'Converting...' : 'Convert'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
