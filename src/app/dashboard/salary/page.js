'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { API_URL } from '../endpoint/endpoint';
import MinimalSelect from '@/components/MinimalSelect';

// ─── Dept / designation maps (same as users page) ─────────────────────────────

const DEPARTMENTS = [
  { value: 'management', label: 'Management' },
  { value: 'development', label: 'Development' },
  { value: 'hr', label: 'Human Resources (HR)' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
];

const DESIGNATIONS_BY_DEPT = {
  management:  [{ value: 'manager', label: 'Manager' }, { value: 'assistant_manager', label: 'Assistant Manager' }],
  development: [
    { value: 'software_engineer', label: 'Software Engineer' },
    { value: 'senior_developer',  label: 'Senior Developer'  },
    { value: 'junior_developer',  label: 'Junior Developer'  },
    { value: 'team_lead',         label: 'Team Lead'         },
    { value: 'qa_engineer',       label: 'QA Engineer'       },
    { value: 'devops_engineer',   label: 'DevOps Engineer'   },
  ],
  hr: [
    { value: 'hr_manager',                    label: 'HR Manager'                    },
    { value: 'hr_executive',                  label: 'HR Executive'                  },
    { value: 'recruiter',                     label: 'Recruiter'                     },
    { value: 'talent_acquisition_specialist', label: 'Talent Acquisition Specialist' },
    { value: 'hr_coordinator',                label: 'HR Coordinator'                },
  ],
  finance: [
    { value: 'finance_manager',   label: 'Finance Manager'   },
    { value: 'accountant',        label: 'Accountant'        },
    { value: 'senior_accountant', label: 'Senior Accountant' },
    { value: 'financial_analyst', label: 'Financial Analyst' },
    { value: 'auditor',           label: 'Auditor'           },
  ],
  marketing: [
    { value: 'marketing_manager',             label: 'Marketing Manager'             },
    { value: 'digital_marketing_executive',   label: 'Digital Marketing Executive'   },
    { value: 'seo_specialist',                label: 'SEO Specialist'                },
    { value: 'content_strategist',            label: 'Content Strategist'            },
    { value: 'social_media_manager',          label: 'Social Media Manager'          },
  ],
  sales: [
    { value: 'sales_manager',                   label: 'Sales Manager'                   },
    { value: 'sales_executive',                 label: 'Sales Executive'                 },
    { value: 'business_development_executive',  label: 'Business Development Executive'  },
    { value: 'sales_coordinator',               label: 'Sales Coordinator'               },
  ],
};

const ALL_DESIGNATIONS = Object.values(DESIGNATIONS_BY_DEPT).flat();

const deptLabel  = (v) => DEPARTMENTS.find(d => d.value === v)?.label || v;
const desigLabel = (v) => ALL_DESIGNATIONS.find(d => d.value === v)?.label || v;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const gross = (r) =>
  Number(r.basic || 0) + Number(r.hra || 0) + Number(r.da || 0) +
  Number(r.travel_allowance || 0) + Number(r.medical_allowance || 0) + Number(r.other_allowance || 0);

const totalDeductions = (r) =>
  Number(r.pf || 0) + Number(r.esi || 0) + Number(r.professional_tax || 0) +
  Number(r.tds || 0) + Number(r.other_deduction || 0);

const net = (r) => gross(r) - totalDeductions(r);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const EMPTY_FORM = {
  basic: '', hra: '', da: '', travel_allowance: '', medical_allowance: '', other_allowance: '',
  pf: '', esi: '', professional_tax: '', tds: '', other_deduction: '',
  effective_date: '',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', placeholder = '', prefix, readOnly }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">{prefix}</span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent py-2 ${prefix ? 'pl-7 pr-3' : 'px-3'} ${readOnly ? 'bg-gray-50 text-gray-500 cursor-default' : ''}`}
        />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SalaryPage() {
  const { addToast } = useToast();

  const [records,    setRecords]    = useState([]);
  const [employees,  setEmployees]  = useState([]);  // all employees for Add dropdown
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const PAGE_SIZE = 10;

  const [search,     setSearch]     = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const [showModal,    setShowModal]    = useState(false);
  const [editing,      setEditing]      = useState(null);  // salary record being edited
  const [selectedUser, setSelectedUser] = useState(null);  // user object picked in Add form
  const [formData,     setFormData]     = useState(EMPTY_FORM);
  const [submitting,   setSubmitting]   = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [toDelete,    setToDelete]    = useState(null);
  const [viewModal,   setViewModal]   = useState(null);

  // ── Fetch salary records ───────────────────────────────────────────────
  const fetchSalary = async (s = search, dept = deptFilter, pg = page) => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: pg, page_size: PAGE_SIZE });
      if (s) p.set('search', s);
      if (dept && dept !== 'All') p.set('department', dept);
      const res = await fetch(`${API_URL}/salary?${p}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setRecords(data.salaries || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } else {
        addToast('Failed to load salary records', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch all employees (for Add dropdown) ─────────────────────────────
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/employees?page_size=100`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.employees || []);
      }
    } catch { /* silent */ }
  };

  useEffect(() => { fetchSalary(); fetchEmployees(); }, []);
  useEffect(() => { setPage(1); }, [search, deptFilter]);
  useEffect(() => {
    const t = setTimeout(() => fetchSalary(search, deptFilter, page), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [search, deptFilter, page]);

  // ── Employees that don't yet have a salary record ─────────────────────
  const assignedUserIds = new Set(records.map(r => r.user_id));
  const availableEmployees = employees.filter(e => !assignedUserIds.has(e.id));

  // ── Handlers ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setSelectedUser(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setSelectedUser(null);
    setFormData({
      basic: r.basic, hra: r.hra, da: r.da,
      travel_allowance: r.travel_allowance, medical_allowance: r.medical_allowance,
      other_allowance: r.other_allowance, pf: r.pf, esi: r.esi,
      professional_tax: r.professional_tax, tds: r.tds, other_deduction: r.other_deduction,
      effective_date: r.effective_date || '',
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (editing) {
        const body = { ...formData };
        // Convert empty strings to null / numbers
        Object.keys(body).forEach(k => {
          if (k === 'effective_date') { body[k] = body[k] || null; }
          else { body[k] = body[k] === '' ? null : Number(body[k]); }
        });
        const res = await fetch(`${API_URL}/salary/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        });
        if (res.ok) {
          addToast('Salary updated', 'success');
          setShowModal(false);
          fetchSalary(search, deptFilter, page);
        } else {
          const err = await res.json();
          addToast(err.detail?.[0]?.msg || err.error || 'Failed to update', 'error');
        }
      } else {
        if (!selectedUser) { addToast('Please select an employee', 'error'); return; }
        const body = {
          user_id: selectedUser.id,
          ...Object.fromEntries(
            Object.entries(formData)
              .filter(([k]) => k !== 'effective_date')
              .map(([k, v]) => [k, v === '' ? 0 : Number(v)])
          ),
        };
        const res = await fetch(`${API_URL}/salary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        });
        if (res.ok) {
          addToast('Salary record created', 'success');
          setShowModal(false);
          fetchSalary(search, deptFilter, 1);
          setPage(1);
        } else {
          const err = await res.json();
          addToast(err.detail?.[0]?.msg || err.error || 'Failed to create', 'error');
        }
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      const res = await fetch(`${API_URL}/salary/${toDelete.id}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (res.ok) {
        addToast('Record deleted', 'success');
        fetchSalary(search, deptFilter, page);
      } else {
        addToast('Failed to delete', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setDeleteModal(false);
      setToDelete(null);
    }
  };

  // ── Computed preview ───────────────────────────────────────────────────
  const previewGross      = gross(formData);
  const previewDeductions = totalDeductions(formData);
  const previewNet        = previewGross - previewDeductions;

  const totalPayroll = records.reduce((s, r) => s + net(r), 0);
  const totalGross   = records.reduce((s, r) => s + gross(r), 0);
  const totalDeduct  = records.reduce((s, r) => s + totalDeductions(r), 0);

  const indexOfFirst = (page - 1) * PAGE_SIZE;

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Salary Setup</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage employee compensation and payroll</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Salary
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Employees" value={total} sub="on payroll" color="bg-primary/10"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard label="Monthly Payroll" value={fmt(totalPayroll)} sub="net salaries" color="bg-emerald-50"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard label="Gross Salary" value={fmt(totalGross)} sub="before deductions" color="bg-blue-50"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
        />
        <StatCard label="Total Deductions" value={fmt(totalDeduct)} sub="PF, ESI, TDS, PT" color="bg-orange-50"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>}
        />
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search by name or employee ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary hover:border-gray-300 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
            <MinimalSelect value={deptFilter} onChange={e => setDeptFilter(e.target.value)} wrapperClassName="w-52">
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </MinimalSelect>
          </div>
          <p className="text-xs text-gray-400 shrink-0">{total} record{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                <th className="px-5 py-3 text-left   text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Basic</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Gross</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Deductions</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Net Salary</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Effective</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-primary"/>
                    Loading…
                  </div>
                </td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-400">No salary records found.</td></tr>
              ) : records.map((r, i) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-500 text-center">{indexOfFirst + i + 1}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">{r.user_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.employee_id} · {r.designation_label}</p>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{r.department_label}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 text-center font-medium">{fmt(r.basic)}</td>
                  <td className="px-5 py-4 text-sm text-blue-700 text-center font-medium">{fmt(gross(r))}</td>
                  <td className="px-5 py-4 text-center"><span className="text-sm text-orange-600 font-medium">−{fmt(totalDeductions(r))}</span></td>
                  <td className="px-5 py-4 text-center"><span className="text-sm font-bold text-emerald-700">{fmt(net(r))}</span></td>
                  <td className="px-5 py-4 text-sm text-gray-500 text-center">{fmtDate(r.effective_date)}</td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      <button onClick={() => setViewModal(r)} className="text-blue-600 hover:text-blue-700 border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors" title="View">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      <button onClick={() => openEdit(r)} className="text-primary hover:text-primary/80 border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button onClick={() => { setToDelete(r); setDeleteModal(true); }} className="text-red-500 hover:text-red-700 border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {total === 0 ? 0 : indexOfFirst + 1}–{Math.min(indexOfFirst + PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white cursor-pointer text-gray-600">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…'); acc.push(p); return acc; }, [])
                .map((p, i) => p === '…'
                  ? <span key={`el-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                  : <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 text-sm rounded-lg transition-colors border-0 cursor-pointer ${page === p ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 bg-transparent'}`}>{p}</button>
                )}
              <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white cursor-pointer text-gray-600">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ──────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-base font-semibold text-gray-900">
                {editing ? `Edit Salary — ${editing.user_name}` : 'Add Salary Structure'}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 border-0 bg-transparent cursor-pointer p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">

              {/* Employee select — Add only */}
              {!editing && (
                <section>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Select Employee</h3>
                  <MinimalSelect
                    value={selectedUser?.id || ''}
                    onChange={e => {
                      const emp = employees.find(x => x.id === Number(e.target.value));
                      setSelectedUser(emp || null);
                    }}
                    required
                  >
                    <option value="">— Choose an employee —</option>
                    {availableEmployees.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.employee_id})
                      </option>
                    ))}
                  </MinimalSelect>

                  {selectedUser && (
                    <div className="mt-3 flex gap-4 bg-gray-50 rounded-xl p-3 text-sm">
                      <div><span className="text-gray-400 text-xs">Department</span><p className="font-medium text-gray-800">{deptLabel(selectedUser.department)}</p></div>
                      <div><span className="text-gray-400 text-xs">Designation</span><p className="font-medium text-gray-800">{desigLabel(selectedUser.designation)}</p></div>
                    </div>
                  )}
                </section>
              )}

              {/* Earnings */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Earnings</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Field label="Basic Salary *" name="basic" type="number" value={formData.basic} onChange={handleChange} placeholder="0" prefix="₹" />
                  <Field label="HRA" name="hra" type="number" value={formData.hra} onChange={handleChange} placeholder="0" prefix="₹" />
                  <Field label="DA" name="da" type="number" value={formData.da} onChange={handleChange} placeholder="0" prefix="₹" />
                  <Field label="Travel Allowance" name="travel_allowance" type="number" value={formData.travel_allowance} onChange={handleChange} placeholder="0" prefix="₹" />
                  <Field label="Medical Allowance" name="medical_allowance" type="number" value={formData.medical_allowance} onChange={handleChange} placeholder="0" prefix="₹" />
                  <Field label="Other Allowance" name="other_allowance" type="number" value={formData.other_allowance} onChange={handleChange} placeholder="0" prefix="₹" />
                </div>
              </section>

              {/* Deductions */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Deductions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Field label="PF (Employee)" name="pf" type="number" value={formData.pf} onChange={handleChange} placeholder="0" prefix="₹" />
                  <Field label="ESI" name="esi" type="number" value={formData.esi} onChange={handleChange} placeholder="0" prefix="₹" />
                  <Field label="Professional Tax" name="professional_tax" type="number" value={formData.professional_tax} onChange={handleChange} placeholder="0" prefix="₹" />
                  <Field label="TDS" name="tds" type="number" value={formData.tds} onChange={handleChange} placeholder="0" prefix="₹" />
                  <Field label="Other Deduction" name="other_deduction" type="number" value={formData.other_deduction} onChange={handleChange} placeholder="0" prefix="₹" />
                </div>
              </section>

              {/* Effective date — Edit only */}
              {editing && (
                <section>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Salary Revision</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Effective Date" name="effective_date" type="date" value={formData.effective_date} onChange={handleChange} />
                  </div>
                </section>
              )}

              {/* Live summary */}
              <section className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Salary Summary</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><p className="text-xs text-gray-400">Gross Salary</p><p className="text-base font-bold text-blue-700">{fmt(previewGross)}</p></div>
                  <div><p className="text-xs text-gray-400">Deductions</p><p className="text-base font-bold text-orange-600">−{fmt(previewDeductions)}</p></div>
                  <div><p className="text-xs text-gray-400">Net Salary</p><p className="text-base font-bold text-emerald-700">{fmt(previewNet)}</p></div>
                </div>
              </section>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-0 cursor-pointer text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors border-0 cursor-pointer text-sm disabled:opacity-60 flex items-center gap-2">
                  {submitting && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"/>}
                  {editing ? 'Update Structure' : 'Save Structure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Modal ────────────────────────────────────────────────────── */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[92vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Salary Details</h2>
              <button type="button" onClick={() => setViewModal(null)} className="text-gray-400 hover:text-gray-600 border-0 bg-transparent cursor-pointer p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                  {viewModal.user_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{viewModal.user_name}</p>
                  <p className="text-xs text-gray-400">{viewModal.employee_id} · {viewModal.designation_label}</p>
                </div>
                <span className="ml-auto text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">{viewModal.department_label}</span>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Earnings</p>
                <div className="space-y-1.5">
                  {[['Basic Salary', viewModal.basic], ['HRA', viewModal.hra], ['DA', viewModal.da],
                    ['Travel Allowance', viewModal.travel_allowance], ['Medical Allowance', viewModal.medical_allowance],
                    ['Other Allowance', viewModal.other_allowance]]
                    .filter(([, v]) => Number(v) > 0)
                    .map(([label, val]) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-medium text-gray-800">{fmt(val)}</span>
                      </div>
                    ))}
                  <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-2 mt-1">
                    <span className="text-blue-700">Gross Salary</span>
                    <span className="text-blue-700">{fmt(gross(viewModal))}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deductions</p>
                <div className="space-y-1.5">
                  {[['PF (Employee)', viewModal.pf], ['ESI', viewModal.esi],
                    ['Professional Tax', viewModal.professional_tax], ['TDS', viewModal.tds],
                    ['Other', viewModal.other_deduction]]
                    .filter(([, v]) => Number(v) > 0)
                    .map(([label, val]) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-medium text-orange-600">−{fmt(val)}</span>
                      </div>
                    ))}
                  <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-2 mt-1">
                    <span className="text-orange-600">Total Deductions</span>
                    <span className="text-orange-600">−{fmt(totalDeductions(viewModal))}</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-emerald-800">Net Take-Home</span>
                <span className="text-lg font-bold text-emerald-700">{fmt(net(viewModal))}</span>
              </div>

              {viewModal.effective_date && (
                <p className="text-xs text-gray-400">Effective from: {fmtDate(viewModal.effective_date)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ──────────────────────────────────────────────────── */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete Salary Record</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            {toDelete && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{toDelete.user_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{toDelete.employee_id} · Net {fmt(net(toDelete))}/mo</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={() => { setDeleteModal(false); setToDelete(null); }} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-0 cursor-pointer text-sm">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-0 cursor-pointer text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
