'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MinimalSelect from '@/components/MinimalSelect';
import { useToast } from '../components/ToastContext';
import { API_URL } from '../endpoint/endpoint';

const PAGE_SIZE = 10;

const EMPTY_FORM = {
  job_title: '',
  department: '',
  role: '',
  qualification_required: '',
  required_experience: '',
  responsibilities: '',
  skills_required: '',
  location: '',
  status: 'active',
};

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm';

// Departments list
const DEPARTMENTS = [
  { value: 'management', label: 'Management' },
  { value: 'development', label: 'Development' },
  { value: 'hr', label: 'Human Resources (HR)' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
];

// Roles grouped by department — same as users page
const ROLES_BY_DEPT = {
  management: [
    { value: 'manager', label: 'Manager' },
    { value: 'assistant_manager', label: 'Assistant Manager' },
  ],
  development: [
    { value: 'software_engineer', label: 'Software Engineer' },
    { value: 'senior_developer', label: 'Senior Developer' },
    { value: 'junior_developer', label: 'Junior Developer' },
    { value: 'team_lead', label: 'Team Lead' },
    { value: 'qa_engineer', label: 'QA Engineer' },
    { value: 'devops_engineer', label: 'DevOps Engineer' },
  ],
  hr: [
    { value: 'hr_manager', label: 'HR Manager' },
    { value: 'hr_executive', label: 'HR Executive' },
    { value: 'recruiter', label: 'Recruiter' },
    { value: 'talent_acquisition_specialist', label: 'Talent Acquisition Specialist' },
    { value: 'hr_coordinator', label: 'HR Coordinator' },
  ],
  finance: [
    { value: 'finance_manager', label: 'Finance Manager' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'senior_accountant', label: 'Senior Accountant' },
    { value: 'financial_analyst', label: 'Financial Analyst' },
    { value: 'auditor', label: 'Auditor' },
  ],
  marketing: [
    { value: 'marketing_manager', label: 'Marketing Manager' },
    { value: 'digital_marketing_executive', label: 'Digital Marketing Executive' },
    { value: 'seo_specialist', label: 'SEO Specialist' },
    { value: 'content_strategist', label: 'Content Strategist' },
    { value: 'social_media_manager', label: 'Social Media Manager' },
  ],
  sales: [
    { value: 'sales_manager', label: 'Sales Manager' },
    { value: 'sales_executive', label: 'Sales Executive' },
    { value: 'business_development_executive', label: 'Business Development Executive' },
    { value: 'sales_coordinator', label: 'Sales Coordinator' },
  ],
};

// All roles flat for display in table
const ALL_ROLES = Object.values(ROLES_BY_DEPT).flat();

export default function OpeningsPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingOpening, setEditingOpening] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [deleteModal, setDeleteModal] = useState(false);
  const [openingToDelete, setOpeningToDelete] = useState(null);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  // Fetch with debounce on search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOpenings(search, statusFilter, page);
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, statusFilter, page]);

  const fetchOpenings = async (searchVal = '', statusVal = 'All', pageVal = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: pageVal, page_size: PAGE_SIZE });
      if (searchVal) params.set('search', searchVal);
      if (statusVal && statusVal !== 'All') params.set('status', statusVal);
      const res = await fetch(`${API_URL}/openings?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setOpenings(data.openings || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      }
    } catch {
      addToast('Failed to fetch openings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getDeptLabel = (val) => DEPARTMENTS.find(d => d.value === val)?.label || val || '—';
  const getRoleLabel = (val) => ALL_ROLES.find(r => r.value === val)?.label || val || '—';

  // Roles available for the currently selected department
  const availableRoles = formData.department ? (ROLES_BY_DEPT[formData.department] || []) : [];

  const handleAdd = () => {
    setEditingOpening(null);
    setFormData({ ...EMPTY_FORM });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (opening) => {
    setEditingOpening(opening);
    setFormData({
      job_title: opening.job_title || '',
      department: opening.department || '',
      role: opening.role || '',
      qualification_required: opening.qualification_required || '',
      required_experience: opening.required_experience ?? '',
      responsibilities: opening.responsibilities || '',
      skills_required: opening.skills_required || '',
      location: opening.location || '',
      status: opening.status || 'active',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.job_title.trim()) errors.job_title = 'Job title is required';
    if (formData.required_experience !== '' && Number(formData.required_experience) < 0)
      errors.required_experience = 'Experience cannot be negative';
    return errors;
  };

  const validateField = (field) => {
    const errors = {};
    if (field === 'job_title' && !formData.job_title.trim())
      errors.job_title = 'Job title is required';
    if (field === 'required_experience' && formData.required_experience !== '' && Number(formData.required_experience) < 0)
      errors.required_experience = 'Experience cannot be negative';
    return errors;
  };

  const handleBlur = (field) => () => {
    const errs = validateField(field);
    setFormErrors(prev => ({ ...prev, ...errs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      job_title: formData.job_title,
      department: formData.department || null,
      role: formData.role || null,
      qualification_required: formData.qualification_required || null,
      required_experience: formData.required_experience !== '' ? Number(formData.required_experience) : null,
      responsibilities: formData.responsibilities || null,
      skills_required: formData.skills_required || null,
      location: formData.location || null,
      ...(editingOpening ? { status: formData.status } : {}),
    };

    try {
      const url = editingOpening ? `${API_URL}/openings/${editingOpening.id}` : `${API_URL}/openings`;
      const method = editingOpening ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        addToast(editingOpening ? 'Opening updated successfully' : 'Opening created successfully', 'success');
        setShowModal(false);
        if (!editingOpening) setPage(1);
        fetchOpenings(search, statusFilter, editingOpening ? page : 1);
      } else {
        const err = await res.json();
        addToast(err.error || 'Failed to save opening', 'error');
      }
    } catch {
      addToast('Network error while saving opening', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (opening) => { setOpeningToDelete(opening); setDeleteModal(true); };

  const confirmDelete = async () => {
    if (!openingToDelete) return;
    try {
      const res = await fetch(`${API_URL}/openings/${openingToDelete.id}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (res.ok) {
        addToast('Opening deleted successfully', 'success');
        fetchOpenings(search, statusFilter, page);
      } else {
        const err = await res.json();
        addToast(err.error || 'Failed to delete opening', 'error');
      }
    } catch {
      addToast('Network error while deleting opening', 'error');
    }
    setDeleteModal(false);
    setOpeningToDelete(null);
  };

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (field === 'job_title') {
      value = value.replace(/[^a-zA-Z\s\-'./()]/g, '');
    } else if (field === 'location') {
      value = value.replace(/[^a-zA-Z\s,.\-]/g, '');
    }
    if (field === 'department') {
      setFormData(p => ({ ...p, department: value, role: '' }));
    } else {
      setFormData(p => ({ ...p, [field]: value }));
    }
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const indexOfFirst = (page - 1) * PAGE_SIZE;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 m-0">Job Openings</h1>
        <p className="text-sm text-gray-400 mt-1 mb-0">Manage all active and inactive job openings.</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search job title, department, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>
            <MinimalSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} wrapperClassName="max-w-[160px]">
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </MinimalSelect>
          </div>
          <button
            onClick={handleAdd}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Opening
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800 m-0">All Openings</h2>
          <span className="text-xs text-gray-400">{total} found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['S.No', 'Job Title', 'Department', 'Role', 'Location', 'Experience', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-primary"/>
                      Loading openings…
                    </div>
                  </td>
                </tr>
              ) : openings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                    {search || statusFilter !== 'All' ? 'No openings match your filters.' : 'No job openings yet.'}
                  </td>
                </tr>
              ) : openings.map((opening, index) => (
                <tr key={opening.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/dashboard/openings/${opening.id}`)}>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{indexOfFirst + index + 1}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-gray-800">{opening.job_title}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{getDeptLabel(opening.department)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{getRoleLabel(opening.role)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{opening.location || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {opening.required_experience != null
                      ? `${opening.required_experience} yr${opening.required_experience !== 1 ? 's' : ''}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      opening.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {opening.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/openings/${opening.id}`); }}
                        className="text-blue-600 hover:text-blue-700 border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors"
                        title="View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(opening); }}
                        className="text-primary hover:text-primary-dark border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(opening); }}
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
              Showing {total === 0 ? 0 : indexOfFirst + 1}–{Math.min(indexOfFirst + PAGE_SIZE, total)} of {total} openings
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
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 m-0">
                {editingOpening ? 'Edit Job Opening' : 'Add New Opening'}
              </h2>
              <button
                type="button"
                onClick={() => { setShowModal(false); setFormErrors({}); }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none border-0 bg-transparent cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.job_title}
                    onChange={handleChange('job_title')}
                    onBlur={handleBlur('job_title')}
                    placeholder="e.g. Senior Software Engineer"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${formErrors.job_title ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'}`}
                  />
                  {formErrors.job_title && <p className="mt-1 text-xs text-red-500">{formErrors.job_title}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <MinimalSelect value={formData.department} onChange={handleChange('department')}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </MinimalSelect>
                </div>

                {/* Role — filtered by department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <MinimalSelect
                    value={formData.role}
                    onChange={handleChange('role')}
                    disabled={!formData.department}
                  >
                    <option value="">{formData.department ? 'Select role' : 'Select department first'}</option>
                    {availableRoles.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </MinimalSelect>
                </div>

                {/* Qualification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification Required</label>
                  <input
                    type="text"
                    value={formData.qualification_required}
                    onChange={handleChange('qualification_required')}
                    placeholder="e.g. B.Tech / B.E. in CS"
                    className={inputCls}
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Experience (years)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.required_experience}
                    onChange={handleChange('required_experience')}
                    onBlur={handleBlur('required_experience')}
                    placeholder="e.g. 2"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${formErrors.required_experience ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'}`}
                  />
                  {formErrors.required_experience && <p className="mt-1 text-xs text-red-500">{formErrors.required_experience}</p>}
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={handleChange('location')}
                    placeholder="e.g. Chennai, Tamil Nadu"
                    className={inputCls}
                  />
                </div>

                {/* Responsibilities */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                  <textarea
                    value={formData.responsibilities}
                    onChange={handleChange('responsibilities')}
                    rows={3}
                    placeholder="Describe the key responsibilities..."
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Skills */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required</label>
                  <textarea
                    value={formData.skills_required}
                    onChange={handleChange('skills_required')}
                    rows={3}
                    placeholder="List the required skills..."
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Status — edit only */}
                {editingOpening && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <MinimalSelect value={formData.status} onChange={handleChange('status')}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </MinimalSelect>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormErrors({}); }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm border-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/>
                      {editingOpening ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingOpening ? 'Update Opening' : 'Add Opening'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 m-0">Delete Job Opening</h3>
                <p className="text-sm text-gray-500 m-0">This action cannot be undone.</p>
              </div>
            </div>
            {openingToDelete && (
              <div className="mb-5 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 m-0">{openingToDelete.job_title}</p>
                {openingToDelete.department && (
                  <p className="text-xs text-gray-500 mt-1 m-0">{getDeptLabel(openingToDelete.department)}</p>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteModal(false); setOpeningToDelete(null); }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm border-0 cursor-pointer"
              >
                Delete Opening
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
