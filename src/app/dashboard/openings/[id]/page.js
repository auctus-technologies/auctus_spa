'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '../../components/ToastContext';
import { API_URL } from '../../endpoint/endpoint';

const STATUS_CONFIG = {
  active:   { bg: 'bg-green-50',  text: 'text-green-700',  ring: 'ring-green-200',  dot: 'bg-green-500'  },
  inactive: { bg: 'bg-gray-50',   text: 'text-gray-600',   ring: 'ring-gray-200',   dot: 'bg-gray-400'   },
};

const DEPARTMENT_LABELS = {
  management:  'Management',
  development: 'Development',
  hr:          'Human Resources (HR)',
  finance:     'Finance',
  marketing:   'Marketing',
  sales:       'Sales',
};

const ROLE_LABELS = {
  manager:                        'Manager',
  assistant_manager:              'Assistant Manager',
  software_engineer:              'Software Engineer',
  senior_developer:               'Senior Developer',
  junior_developer:               'Junior Developer',
  team_lead:                      'Team Lead',
  qa_engineer:                    'QA Engineer',
  devops_engineer:                'DevOps Engineer',
  hr_manager:                     'HR Manager',
  hr_executive:                   'HR Executive',
  recruiter:                      'Recruiter',
  talent_acquisition_specialist:  'Talent Acquisition Specialist',
  hr_coordinator:                 'HR Coordinator',
  finance_manager:                'Finance Manager',
  accountant:                     'Accountant',
  senior_accountant:              'Senior Accountant',
  financial_analyst:              'Financial Analyst',
  auditor:                        'Auditor',
  marketing_manager:              'Marketing Manager',
  digital_marketing_executive:    'Digital Marketing Executive',
  seo_specialist:                 'SEO Specialist',
  content_strategist:             'Content Strategist',
  social_media_manager:           'Social Media Manager',
  sales_manager:                  'Sales Manager',
  sales_executive:                'Sales Executive',
  business_development_executive: 'Business Development Executive',
  sales_coordinator:              'Sales Coordinator',
};

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

export default function OpeningDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();

  const [opening, setOpening] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!params.id) return;
    fetchOpening();
  }, [params.id]);

  const fetchOpening = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/openings/${params.id}`, { credentials: 'include' });
      if (res.ok) {
        setOpening(await res.json());
      } else {
        const err = await res.json();
        setError(err.detail || err.error || 'Failed to fetch opening');
      }
    } catch {
      setError('Network error while fetching opening');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50/70 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Loading opening…</p>
        </div>
      </div>
    );
  }

  if (error || !opening) {
    return (
      <div className="bg-gray-50/70 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{error ? 'Error Loading Opening' : 'Opening Not Found'}</h1>
          <p className="text-gray-500 text-sm">{error || "This opening doesn't exist."}</p>
          <button
            onClick={() => router.push('/dashboard/openings')}
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer"
          >
            Back to Openings
          </button>
        </div>
      </div>
    );
  }

  const statusCls = STATUS_CONFIG[opening.status] || STATUS_CONFIG.inactive;
  const statusLabel = opening.status === 'active' ? 'Active' : 'Inactive';
  const departmentLabel = DEPARTMENT_LABELS[opening.department] || opening.department || '—';
  const roleLabel = ROLE_LABELS[opening.role] || opening.role || '—';

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      ),
    },
    {
      id: 'details',
      label: 'Details',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h10"/>
        </svg>
      ),
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <Section title="Job Information">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                <Field label="Job Title"    value={opening.job_title} />
                <Field label="Department"   value={departmentLabel} />
                <Field label="Role"         value={roleLabel} />
                <Field label="Location"     value={opening.location} />
                <Field label="Experience"   value={opening.required_experience != null ? `${opening.required_experience} yr${opening.required_experience !== 1 ? 's' : ''}` : null} />
                <Field label="Qualification" value={opening.qualification_required} />
                <Field label="Status"       value={
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ring-1 ${statusCls.bg} ${statusCls.text} ${statusCls.ring}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCls.dot}`} />
                    {statusLabel}
                  </span>
                } />
                <Field label="Created At"   value={formatDate(opening.created_at)} />
                <Field label="Last Updated" value={formatDate(opening.updated_at)} />
              </div>
            </Section>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-4">
            {opening.responsibilities ? (
              <Section title="Responsibilities">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{opening.responsibilities}</p>
              </Section>
            ) : null}

            {opening.skills_required ? (
              <Section title="Skills Required">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{opening.skills_required}</p>
              </Section>
            ) : null}

            {!opening.responsibilities && !opening.skills_required && (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-400 font-medium">No additional details available.</p>
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

      {/* Top Nav Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard/openings')}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer bg-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => router.push('/dashboard/openings')}>
                Openings
              </span>
              <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span className="text-gray-900 font-semibold">{opening.job_title}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/openings')}
            className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
          >
            Back to Openings
          </button>
        </div>
      </div>

      {/* Page Body */}
      <div className="px-6 py-6 space-y-5">

        {/* Hero Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5">

            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{opening.job_title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{departmentLabel}{opening.role ? ` · ${roleLabel}` : ''}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                {opening.location && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {opening.location}
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${statusCls.bg} ${statusCls.text} ${statusCls.ring}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusCls.dot}`} />
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Side stats */}
            <div className="flex sm:flex-col gap-2 shrink-0">
              <div className="text-center px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Experience</p>
                <p className="text-sm font-bold text-gray-800">
                  {opening.required_experience != null ? `${opening.required_experience} yr${opening.required_experience !== 1 ? 's' : ''}` : '—'}
                </p>
              </div>
              <div className="text-center px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Posted</p>
                <p className="text-sm font-bold text-gray-800">{formatDate(opening.created_at)}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs + Content */}
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
                  <span className={activeTab === id ? 'text-primary' : 'text-gray-300 group-hover:text-gray-400'}>
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-5">
            {renderTabContent()}
          </div>
        </div>

      </div>
    </div>
  );
}
