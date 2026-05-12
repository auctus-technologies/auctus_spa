'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '../../components/ToastContext';
import { API_URL } from '../../endpoint/endpoint';
import FileViewerModal from '../../components/FileViewerModal';

const STATUS_CONFIG = {
  Completed: { bg: 'bg-green-50',  text: 'text-green-700',  ring: 'ring-green-200', dot: 'bg-green-500'  },
  Progress:  { bg: 'bg-blue-50',   text: 'text-blue-700',   ring: 'ring-blue-200',  dot: 'bg-blue-500'   },
  Planning:  { bg: 'bg-yellow-50', text: 'text-yellow-700', ring: 'ring-yellow-200',dot: 'bg-yellow-500' },
  Testing:   { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-200',dot: 'bg-purple-500' },
  'On Hold': { bg: 'bg-red-50',    text: 'text-red-700',    ring: 'ring-red-200',   dot: 'bg-red-500'    },
};

const formatDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
};

const DESIGNATION_LABELS = {
  manager: 'Manager',
  assistant_manager: 'Assistant Manager',
  software_engineer: 'Software Engineer',
  senior_developer: 'Senior Developer',
  junior_developer: 'Junior Developer',
  team_lead: 'Team Lead',
  qa_engineer: 'QA Engineer',
  devops_engineer: 'DevOps Engineer',
  hr_manager: 'HR Manager',
  hr_executive: 'HR Executive',
  recruiter: 'Recruiter',
  talent_acquisition_specialist: 'Talent Acquisition Specialist',
  hr_coordinator: 'HR Coordinator',
  finance_manager: 'Finance Manager',
  accountant: 'Accountant',
  senior_accountant: 'Senior Accountant',
  financial_analyst: 'Financial Analyst',
  auditor: 'Auditor',
  marketing_manager: 'Marketing Manager',
  digital_marketing_executive: 'Digital Marketing Executive',
  seo_specialist: 'SEO Specialist',
  content_strategist: 'Content Strategist',
  social_media_manager: 'Social Media Manager',
  sales_manager: 'Sales Manager',
  sales_executive: 'Sales Executive',
  business_development_executive: 'Business Development Executive',
  sales_coordinator: 'Sales Coordinator',
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [previewAttachment, setPreviewAttachment] = useState(null);

  useEffect(() => {
    if (!params.id) return;
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/projects/${params.id}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProject({
          id: data.id,
          name: data.name,
          clientName: data.client_name,
          description: data.description || '',
          requirements: data.requirements || '',
          team: data.team_member_names || [],
          teamDetails: data.team_member_details || [],
          startDate: data.start_date,
          endDate: data.end_date,
          status: data.status,
          attachments: data.attachments || [],
          createdBy: data.created_by || null,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to fetch project');
      }
    } catch {
      setError('Network error while fetching project');
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="bg-gray-50/70 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Loading project…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !project) {
    return (
      <div className="bg-gray-50/70 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{error ? 'Error Loading Project' : 'Project Not Found'}</h1>
          <p className="text-gray-500 text-sm">{error || "This project doesn't exist."}</p>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const statusCls = STATUS_CONFIG[project.status] || { bg: 'bg-gray-50', text: 'text-gray-600', ring: 'ring-gray-200', dot: 'bg-gray-400' };

  const tabs = [
    {
      id: 'overview', label: 'Overview',
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
    },
    {
      id: 'team', label: 'Team Members',
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
    },
    {
      id: 'attachments', label: `Attachments${project.attachments.length > 0 ? ` (${project.attachments.length})` : ''}`,
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {

      case 'overview':
        return (
          <div className="space-y-4">
            <Section title="Project Information">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                <Field label="Project Name"  value={project.name} />
                <Field label="Client"        value={project.clientName} />
                <Field label="Status"        value={
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ring-1 ${statusCls.bg} ${statusCls.text} ${statusCls.ring}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCls.dot}`} />
                    {project.status}
                  </span>
                } />
                <Field label="Start Date"    value={formatDate(project.startDate)} />
                <Field label="End Date"      value={formatDate(project.endDate)} />
                <Field label="Created By"    value={project.createdBy} />
                <Field label="Created At"    value={formatDate(project.createdAt)} />
                <Field label="Last Updated"  value={formatDate(project.updatedAt)} />
                <Field label="Team Size"     value={`${project.team.length} member${project.team.length !== 1 ? 's' : ''}`} />
              </div>
            </Section>

            {project.description && (
              <Section title="Description">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </Section>
            )}

            {project.requirements && (
              <Section title="Requirements">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{project.requirements}</p>
              </Section>
            )}

            {!project.description && !project.requirements && (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-400 font-medium">No additional details available.</p>
              </div>
            )}
          </div>
        );

      case 'team':
        return (
          <Section title="Team Members">
            {project.teamDetails.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-400 font-medium">No team members assigned</p>
                <p className="text-xs text-gray-300 mt-1">Team members will appear here once assigned.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {project.teamDetails.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0 overflow-hidden">
                      {member.avatar_url ? (
                        <img src={`${BACKEND_URL}${member.avatar_url}`} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{member.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {member.designation ? (DESIGNATION_LABELS[member.designation] || member.designation) : 'Team Member'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        );

      case 'attachments':
        return (
          <Section title="Attachments">
            {project.attachments.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-400 font-medium">No attachments</p>
                <p className="text-xs text-gray-300 mt-1">Files uploaded to this project will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {project.attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{att.file_name}</p>
                        <p className="text-xs text-gray-400">
                          {formatFileSize(att.file_size)}
                          {att.uploaded_by && ` · ${att.uploaded_by}`}
                          {att.uploaded_at && ` · ${formatDate(att.uploaded_at)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewAttachment(att)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                        title="Preview"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <a
                        href={`${API_URL}/projects/${project.id}/attachments/${att.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-colors"
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
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
              onClick={() => router.push('/dashboard/projects')}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer bg-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hover:text-gray-700 cursor-pointer" onClick={() => router.push('/dashboard/projects')}>
                Projects
              </span>
              <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span className="text-gray-900 font-semibold">{project.name}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
          >
            Back to Projects
          </button>
        </div>
      </div>

      {/* ── Page Body ── */}
      <div className="px-6 py-6 space-y-5">

        {/* ── Hero Card ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5">

            {/* Project icon */}
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
              </svg>
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{project.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{project.clientName}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {formatDate(project.startDate)} — {formatDate(project.endDate)}
                </span>
                {project.createdBy && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Created by {project.createdBy}
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${statusCls.bg} ${statusCls.text} ${statusCls.ring}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusCls.dot}`} />
                  {project.status}
                </span>
              </div>
            </div>

            {/* Side stats */}
            <div className="flex sm:flex-col gap-2 shrink-0">
              <div className="text-center px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Team</p>
                <p className="text-sm font-bold text-gray-800">{project.team.length} member{project.team.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="text-center px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Files</p>
                <p className="text-sm font-bold text-gray-800">{project.attachments.length}</p>
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

      <FileViewerModal
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        attachment={previewAttachment}
        projectId={project.id}
      />
    </div>
  );
}
