'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/app/dashboard/components/ToastContext';
import { API_URL } from '@/app/dashboard/endpoint/endpoint';
import MinimalSelect from '@/components/MinimalSelect';

const STATUS_CONFIG = {
  proposal:      { label: 'Proposal',      bg: 'bg-amber-50',  text: 'text-amber-700',  ring: 'ring-amber-200',  dot: 'bg-amber-500'  },
  sent:          { label: 'Sent',           bg: 'bg-blue-50',   text: 'text-blue-700',   ring: 'ring-blue-200',   dot: 'bg-blue-500'   },
  processing:    { label: 'Processing',     bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-200', dot: 'bg-purple-500' },
  client:        { label: 'Client',         bg: 'bg-green-50',  text: 'text-green-700',  ring: 'ring-green-200',  dot: 'bg-green-500'  },
  lost:          { label: 'Lost',           bg: 'bg-red-50',    text: 'text-red-700',    ring: 'ring-red-200',    dot: 'bg-red-500'    },
  not_interested:{ label: 'Not Interested', bg: 'bg-gray-50',   text: 'text-gray-600',   ring: 'ring-gray-200',   dot: 'bg-gray-400'   },
};

const LEAD_FROM_LABELS = {
  instagram: 'Instagram', facebook: 'Facebook', whatsapp: 'WhatsApp',
  meta_ads: 'Meta Ads', linkedin: 'LinkedIn', email: 'Email',
  website: 'Website', referral: 'Referral', youtube: 'YouTube',
  twitter: 'Twitter', other: 'Other',
};

const DESIGNATION_LABELS = {
  manager: 'Manager', assistant_manager: 'Assistant Manager',
  software_engineer: 'Software Engineer', senior_developer: 'Senior Developer',
  junior_developer: 'Junior Developer', team_lead: 'Team Lead',
  qa_engineer: 'QA Engineer', devops_engineer: 'DevOps Engineer',
  hr_manager: 'HR Manager', hr_executive: 'HR Executive',
  recruiter: 'Recruiter', talent_acquisition_specialist: 'Talent Acquisition Specialist',
  hr_coordinator: 'HR Coordinator', finance_manager: 'Finance Manager',
  accountant: 'Accountant', senior_accountant: 'Senior Accountant',
  financial_analyst: 'Financial Analyst', auditor: 'Auditor',
  marketing_manager: 'Marketing Manager', digital_marketing_executive: 'Digital Marketing Executive',
  seo_specialist: 'SEO Specialist', content_strategist: 'Content Strategist',
  social_media_manager: 'Social Media Manager', sales_manager: 'Sales Manager',
  sales_executive: 'Sales Executive', business_development_executive: 'Business Development Executive',
  sales_coordinator: 'Sales Coordinator',
};

const EMPTY_FU_FORM = { follow_up_user_id: '', follow_up_date: '', notes: '' };

const formatDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
};

const Field = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
    <p className="text-base text-gray-800 font-medium">{value || <span className="text-gray-300 font-normal">—</span>}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100">
      <h3 className="text-base font-semibold text-gray-700">{title}</h3>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

export default function LeadDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { addToast } = useToast();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Convert to client
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [converting, setConverting] = useState(false);

  // Follow-ups
  const [followUps, setFollowUps] = useState([]);
  const [followUpUsers, setFollowUpUsers] = useState([]);
  const [fuLoading, setFuLoading] = useState(false);
  const [showFuModal, setShowFuModal] = useState(false);
  const [editingFu, setEditingFu] = useState(null);
  const [fuForm, setFuForm] = useState(EMPTY_FU_FORM);
  const [fuSaving, setFuSaving] = useState(false);
  const [showFuDeleteConfirm, setShowFuDeleteConfirm] = useState(false);
  const [deletingFu, setDeletingFu] = useState(null);
  const [fuDeleting, setFuDeleting] = useState(false);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/leads/${id}`, { credentials: 'include' });
      if (res.ok) {
        setLead(await res.json());
      } else if (res.status === 404) {
        addToast('Lead not found', 'error');
        router.push('/dashboard/leads');
      } else {
        addToast('Failed to load lead', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowUps = async () => {
    try {
      setFuLoading(true);
      const res = await fetch(`${API_URL}/leads/${id}/follow-ups`, { credentials: 'include' });
      if (res.ok) setFollowUps(await res.json());
    } catch {
      addToast('Failed to load follow-ups', 'error');
    } finally {
      setFuLoading(false);
    }
  };

  const fetchFollowUpUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/lead-follow-up-users`, { credentials: 'include' });
      if (res.ok) setFollowUpUsers(await res.json());
    } catch { /* non-critical */ }
  };

  useEffect(() => { if (id) { fetchLead(); fetchFollowUps(); fetchFollowUpUsers(); } }, [id]);

  const confirmConvert = async () => {
    setConverting(true);
    try {
      const res = await fetch(`${API_URL}/leads/${id}/convert-to-client`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        addToast(`${lead.client_name} converted to client`, 'success');
        setShowConvertConfirm(false);
        fetchLead();
      } else {
        const err = await res.json();
        addToast(err.detail || err.error || 'Failed to convert', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setConverting(false);
    }
  };

  const openAddFu = () => {
    setEditingFu(null);
    setFuForm(EMPTY_FU_FORM);
    setShowFuModal(true);
  };

  const openEditFu = (fu) => {
    setEditingFu(fu);
    setFuForm({
      follow_up_user_id: fu.follow_up_user_id ? String(fu.follow_up_user_id) : '',
      follow_up_date: fu.follow_up_date || '',
      notes: fu.notes || '',
    });
    setShowFuModal(true);
  };

  const handleFuSubmit = async (e) => {
    e.preventDefault();
    setFuSaving(true);
    try {
      const body = {
        follow_up_user_id: fuForm.follow_up_user_id ? parseInt(fuForm.follow_up_user_id) : null,
        follow_up_date: fuForm.follow_up_date,
        notes: fuForm.notes || null,
      };
      const url = editingFu
        ? `${API_URL}/leads/${id}/follow-ups/${editingFu.id}`
        : `${API_URL}/leads/${id}/follow-ups`;
      const method = editingFu ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (res.ok) {
        addToast(editingFu ? 'Follow-up updated' : 'Follow-up added', 'success');
        setShowFuModal(false);
        fetchFollowUps();
      } else {
        const err = await res.json();
        addToast(err.detail || err.error || 'Failed to save follow-up', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setFuSaving(false);
    }
  };

  const confirmDeleteFu = async () => {
    if (!deletingFu) return;
    setFuDeleting(true);
    try {
      const res = await fetch(`${API_URL}/leads/${id}/follow-ups/${deletingFu.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        addToast('Follow-up deleted', 'success');
        setShowFuDeleteConfirm(false);
        setDeletingFu(null);
        fetchFollowUps();
      } else {
        addToast('Failed to delete follow-up', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setFuDeleting(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="bg-gray-50/70 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Loading lead…</p>
        </div>
      </div>
    );
  }

  if (!lead) return null;

  const statusCls = STATUS_CONFIG[lead.status] || { bg: 'bg-gray-50', text: 'text-gray-600', ring: 'ring-gray-200', dot: 'bg-gray-400', label: lead.status };

  const tabs = [
    {
      id: 'overview', label: 'Overview',
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
    },
    {
      id: 'contact', label: 'Contact & Location',
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
    },
    {
      id: 'followup', label: `Follow Up${followUps.length > 0 ? ` (${followUps.length})` : ''}`,
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <Section title="Lead Information">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                <Field label="Client Name" value={lead.client_name} />
                <Field label="Company" value={lead.company_name} />
                <Field label="Status" value={
                  lead.status ? (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ring-1 ${statusCls.bg} ${statusCls.text} ${statusCls.ring}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCls.dot}`} />
                      {statusCls.label}
                    </span>
                  ) : null
                } />
                <Field label="Source" value={lead.lead_from ? LEAD_FROM_LABELS[lead.lead_from] || lead.lead_from : null} />
                <Field label="Lead Date" value={formatDate(lead.lead_date)} />
                <Field label="Created At" value={formatDate(lead.created_at)} />
                <Field label="Last Updated" value={formatDate(lead.updated_at)} />
              </div>
            </Section>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <Section title="Contact Information">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                <Field label="Email" value={
                  lead.email ? (
                    <a href={`mailto:${lead.email}`} className="text-primary hover:underline font-medium text-base">{lead.email}</a>
                  ) : null
                } />
                <Field label="Phone" value={lead.phone} />
              </div>
            </Section>
            <Section title="Location">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                <Field label="Country" value={lead.country} />
                <Field label="State" value={lead.state} />
                <Field label="Address" value={lead.address} />
              </div>
            </Section>
          </div>
        );

      case 'followup':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{followUps.length} follow-up{followUps.length !== 1 ? 's' : ''} recorded</p>
              <button
                onClick={openAddFu}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer"
              >
                + Add Follow Up
              </button>
            </div>

            {fuLoading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary mx-auto" />
              </div>
            ) : followUps.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-400 font-medium">No follow-ups yet</p>
                <p className="text-xs text-gray-300 mt-1">Add a follow-up to track your progress with this lead.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {followUps.map((fu) => (
                  <div key={fu.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            {formatDate(fu.follow_up_date)}
                          </span>
                          {fu.follow_up_user_name && (
                            <span className="flex items-center gap-1.5 text-xs text-gray-500">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                              </svg>
                              {fu.follow_up_user_name}
                            </span>
                          )}
                        </div>
                        {fu.notes ? (
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{fu.notes}</p>
                        ) : (
                          <p className="text-sm text-gray-300 italic">No notes</p>
                        )}
                        <p className="text-xs text-gray-300 mt-2">Added {formatDate(fu.created_at)}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => openEditFu(fu)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-primary transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => { setDeletingFu(fu); setShowFuDeleteConfirm(true); }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50/70 min-h-screen">

      {/* ── Top Nav Bar ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard/leads')}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer bg-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => router.push('/dashboard/leads')}>Leads</span>
              <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span className="text-gray-900 font-semibold">{lead.client_name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lead.status !== 'client' && (
              <button
                onClick={() => setShowConvertConfirm(true)}
                className="px-3.5 py-1.5 rounded-lg border-0 text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
              >
                Convert to Client
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Page Body ── */}
      <div className="px-6 py-6 space-y-5">

        {/* ── Hero Card ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{lead.client_name}</h2>
              {lead.company_name && <p className="text-sm text-gray-500 mt-0.5">{lead.company_name}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                {lead.email && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    {lead.email}
                  </span>
                )}
                {lead.phone && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    {lead.phone}
                  </span>
                )}
                {lead.status && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${statusCls.bg} ${statusCls.text} ${statusCls.ring}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusCls.dot}`} />
                    {statusCls.label}
                  </span>
                )}
              </div>
            </div>
            <div className="flex sm:flex-col gap-2 shrink-0">
              <div className="text-center px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Source</p>
                <p className="text-sm font-bold text-gray-800">{lead.lead_from ? LEAD_FROM_LABELS[lead.lead_from] || lead.lead_from : '—'}</p>
              </div>
              <div className="text-center px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Follow-ups</p>
                <p className="text-sm font-bold text-gray-800">{followUps.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs + Content ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="border-b border-gray-100 px-4 overflow-x-auto">
            <nav className="flex gap-0 -mb-px">
              {tabs.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`group flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer bg-transparent ${
                    activeTab === id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                  }`}
                >
                  <span className={activeTab === id ? 'text-primary' : 'text-gray-300 group-hover:text-gray-400'}>{icon}</span>
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-5">{renderTabContent()}</div>
        </div>

      </div>

      {/* ── Convert to Client Modal ── */}
      {showConvertConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Convert to Client</h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Convert <span className="font-medium">{lead.client_name}</span>
              {lead.company_name ? ` from ${lead.company_name}` : ''} to a client?
              A client record will be created and the status will be set to <span className="font-medium">Client</span>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConvertConfirm(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={confirmConvert} disabled={converting} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-60">
                {converting ? 'Converting...' : 'Convert'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Follow-up Modal ── */}
      {showFuModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editingFu ? 'Edit Follow Up' : 'Add Follow Up'}</h2>
              <button type="button" onClick={() => setShowFuModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleFuSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow Up User</label>
                <MinimalSelect
                  value={fuForm.follow_up_user_id}
                  onChange={(e) => setFuForm(prev => ({ ...prev, follow_up_user_id: e.target.value }))}
                >
                  <option value="">— Select User —</option>
                  {followUpUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name}{u.designation ? ` (${DESIGNATION_LABELS[u.designation] || u.designation})` : ''}
                    </option>
                  ))}
                </MinimalSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow Up Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={fuForm.follow_up_date}
                  onChange={(e) => setFuForm(prev => ({ ...prev, follow_up_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={fuForm.notes}
                  onChange={(e) => setFuForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  placeholder="Add follow-up notes..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={fuSaving} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm disabled:opacity-60">
                  {fuSaving ? 'Saving...' : editingFu ? 'Update' : 'Add Follow Up'}
                </button>
                <button type="button" onClick={() => setShowFuModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Follow-up Confirmation ── */}
      {showFuDeleteConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                <polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Follow Up</h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete this follow-up? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setShowFuDeleteConfirm(false); setDeletingFu(null); }} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={confirmDeleteFu} disabled={fuDeleting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-60">
                {fuDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
