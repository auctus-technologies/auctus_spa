'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../components/AuthContext';
import { useToast } from '../components/ToastContext';
import { API_URL } from '../endpoint/endpoint';
import MinimalSelect from '@/components/MinimalSelect';

const PRIORITY_CONFIG = {
  low:    { label: 'Low',    cls: 'bg-green-50 text-green-700'   },
  medium: { label: 'Medium', cls: 'bg-yellow-50 text-yellow-700' },
  high:   { label: 'High',   cls: 'bg-red-50 text-red-700'       },
};

const STATUS_CONFIG = {
  in_progress: { label: 'In Progress', cls: 'bg-blue-50 text-blue-700'   },
  review:      { label: 'Review',      cls: 'bg-purple-50 text-purple-700' },
  completed:   { label: 'Completed',   cls: 'bg-green-50 text-green-700'  },
};

const DESIGNATION_LABELS = {
  manager: 'Manager', assistant_manager: 'Assistant Manager',
  software_engineer: 'Software Engineer', senior_developer: 'Senior Developer',
  junior_developer: 'Junior Developer', team_lead: 'Team Lead',
  qa_engineer: 'QA Engineer', devops_engineer: 'DevOps Engineer',
  hr_manager: 'HR Manager', hr_executive: 'HR Executive',
  recruiter: 'Recruiter', marketing_manager: 'Marketing Manager',
  digital_marketing_executive: 'Digital Marketing Executive',
  sales_manager: 'Sales Manager', sales_executive: 'Sales Executive',
  business_development_executive: 'Business Development Executive',
};

const PAGE_SIZE = 10;

/* Dropdown that escapes table overflow via fixed positioning */
function TableStatusSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 0, left: 0, width: 0 });
  const btnRef          = useRef(null);
  const menuRef         = useRef(null);

  const options = [
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review',      label: 'Review'      },
    { value: 'completed',   label: 'Completed'   },
  ];

  const current = STATUS_CONFIG[value] || { label: value, cls: 'bg-gray-100 text-gray-600' };

  const openMenu = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!btnRef.current?.contains(e.target) && !menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
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
          ref={menuRef}
          style={{ position: 'absolute', top: pos.top, left: pos.left, minWidth: Math.max(pos.width, 140), zIndex: 9999 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {options.map(opt => {
            const cfg = STATUS_CONFIG[opt.value];
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer border-0 bg-transparent ${String(opt.value) === String(value) ? 'font-semibold' : 'text-gray-700'}`}
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

export default function TasksPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const isAdmin = user?.role === 'admin';

  const [tasks, setTasks]           = useState([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);

  const [search, setSearch]             = useState('');
  const [priorityFilter, setPriority]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [allUsers, setAllUsers]     = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [formData, setFormData]     = useState({
    title: '', description: '', priority: 'medium',
    assigned_user_ids: [], due_date: '', project_id: '',
  });

  const [deleteModal, setDeleteModal]   = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => { setPage(1); }, [search, priorityFilter, statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => fetchTasks(), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [search, priorityFilter, statusFilter, page]);

  useEffect(() => { if (isAdmin) { fetchUsers(); fetchProjects(); } }, [isAdmin]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (search) p.set('search', search);
      if (priorityFilter !== 'all') p.set('priority', priorityFilter);
      if (statusFilter !== 'all') p.set('status', statusFilter);
      p.set('page', page);
      p.set('page_size', PAGE_SIZE);
      const res = await fetch(`${API_URL}/tasks?${p}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/team-members`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data.members || []);
      }
    } catch (e) { console.error(e); }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects?page_size=100`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAllProjects(data.projects || []);
      }
    } catch (e) { console.error(e); }
  };

  const openAdd = () => {
    setEditing(null);
    setFormData({ title: '', description: '', priority: 'medium', assigned_user_ids: [], due_date: '', project_id: '' });
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      assigned_user_ids: task.assigned_user_ids,
      due_date: task.due_date,
      project_id: task.project_id || '',
    });
    setShowModal(true);
  };

  // Users available for assignment — filtered to selected project's team members
  const availableUsers = formData.project_id
    ? (() => {
        const proj = allProjects.find(p => p.id === Number(formData.project_id));
        if (!proj) return allUsers;
        const memberIds = new Set(proj.team_members || []);
        return allUsers.filter(u => memberIds.has(u.id));
      })()
    : allUsers;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = JSON.stringify({
      title: formData.title,
      description: formData.description || null,
      priority: formData.priority,
      assigned_user_ids: formData.assigned_user_ids,
      due_date: formData.due_date,
      project_id: formData.project_id ? Number(formData.project_id) : null,
    });
    const headers = { 'Content-Type': 'application/json' };

    try {
      const url    = editing ? `${API_URL}/tasks/${editing.id}` : `${API_URL}/tasks`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body, credentials: 'include' });
      if (res.ok) {
        addToast(editing ? 'Task updated' : 'Task created', 'success');
        setShowModal(false);
        fetchTasks();
      } else {
        const err = await res.json();
        addToast(err.detail?.[0]?.msg || err.error || 'Failed to save task', 'error');
      }
    } catch { addToast('Network error', 'error'); }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        addToast('Status updated', 'success');
      } else {
        addToast('Failed to update status', 'error');
      }
    } catch { addToast('Network error', 'error'); }
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      const res = await fetch(`${API_URL}/tasks/${taskToDelete.id}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (res.ok) {
        addToast('Task deleted', 'success');
        setDeleteModal(false);
        setTaskToDelete(null);
        fetchTasks();
      } else {
        addToast('Failed to delete task', 'error');
      }
    } catch { addToast('Network error', 'error'); }
  };

  const toggleUser = (id) => {
    setFormData(f => ({
      ...f,
      assigned_user_ids: f.assigned_user_ids.includes(id)
        ? f.assigned_user_ids.filter(x => x !== id)
        : [...f.assigned_user_ids, id],
    }));
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—';
  const isOverdue  = (d, status) => status !== 'completed' && d && new Date(d) < new Date();

  const indexOfFirst = (page - 1) * PAGE_SIZE;

  const getUserLabel = (m) => {
    const desig = m.designation ? DESIGNATION_LABELS[m.designation] || m.designation : null;
    return desig ? `${m.name} (${desig})` : m.name;
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 m-0">Tasks</h1>
        {isAdmin && (
          <button
            onClick={openAdd}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
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
            <MinimalSelect value={priorityFilter} onChange={e => setPriority(e.target.value)} wrapperClassName="w-40">
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </MinimalSelect>
            <MinimalSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)} wrapperClassName="w-40">
              <option value="all">All Statuses</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </MinimalSelect>
          </div>
          <p className="text-xs text-gray-400 shrink-0">{total} task{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                {isAdmin && <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={isAdmin ? 8 : 7} className="px-5 py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-primary"/>
                    Loading tasks…
                  </div>
                </td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan={isAdmin ? 8 : 7} className="px-5 py-10 text-center text-sm text-gray-400">
                  No tasks found.
                </td></tr>
              ) : tasks.map((task, i) => {
                const overdue = isOverdue(task.due_date, task.status);
                const pc = PRIORITY_CONFIG[task.priority] || { label: task.priority, cls: 'bg-gray-100 text-gray-600' };
                const sc = STATUS_CONFIG[task.status]    || { label: task.status,    cls: 'bg-gray-100 text-gray-600' };
                return (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-500 text-center">{indexOfFirst + i + 1}</td>
                    <td className="px-5 py-4 max-w-xs text-center">
                      <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{task.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {task.project_name ? (
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{task.project_name}</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pc.cls}`}>{pc.label}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {task.assigned_user_names.length === 0 ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : task.assigned_user_names.map((name, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {formatDate(task.due_date)}
                        {overdue && <span className="ml-1 text-xs">(Overdue)</span>}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <TableStatusSelect
                        value={task.status}
                        onChange={newStatus => handleStatusChange(task.id, newStatus)}
                      />
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-4 text-center">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => openEdit(task)}
                            className="text-primary hover:text-primary/80 border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => { setTaskToDelete(task); setDeleteModal(true); }}
                            className="text-red-500 hover:text-red-700 border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    )}
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
              Showing {total === 0 ? 0 : indexOfFirst + 1}–{Math.min(indexOfFirst + PAGE_SIZE, total)} of {total} tasks
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white cursor-pointer text-gray-600"
              >Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) => p === '…' ? (
                  <span key={`el-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-sm rounded-lg transition-colors border-0 cursor-pointer ${page === p ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 bg-transparent'}`}
                  >{p}</button>
                ))}
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white cursor-pointer text-gray-600"
              >Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Task' : 'Add Task'}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 border-0 bg-transparent cursor-pointer p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  placeholder="Enter task description"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <MinimalSelect
                  value={formData.project_id}
                  onChange={e => {
                    const pid = e.target.value;
                    setFormData(f => ({ ...f, project_id: pid, assigned_user_ids: [] }));
                  }}
                >
                  <option value="">— No Project —</option>
                  {allProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </MinimalSelect>
                {formData.project_id && (() => {
                  const proj = allProjects.find(p => p.id === Number(formData.project_id));
                  const count = proj?.team_members?.length ?? 0;
                  return <p className="text-xs text-gray-400 mt-1">{count} team member{count !== 1 ? 's' : ''} in this project</p>;
                })()}
              </div>

              {/* Priority & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority <span className="text-red-500">*</span></label>
                  <MinimalSelect
                    value={formData.priority}
                    onChange={e => setFormData(f => ({ ...f, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </MinimalSelect>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={e => setFormData(f => ({ ...f, due_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Assigned Users */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Users
                  {formData.project_id && <span className="ml-1 text-xs font-normal text-indigo-500">(filtered to project team)</span>}
                </label>
                <div className="border border-gray-200 rounded-lg max-h-44 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {availableUsers.length === 0 ? (
                    <p className="text-sm text-gray-400 p-2">
                      {formData.project_id ? 'No team members in this project' : 'No users available'}
                    </p>
                  ) : availableUsers.map(m => (
                    <label key={m.id} className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.assigned_user_ids.includes(m.id)}
                        onChange={() => toggleUser(m.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 truncate">{getUserLabel(m)}</span>
                    </label>
                  ))}
                </div>
                {formData.assigned_user_ids.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">{formData.assigned_user_ids.length} user{formData.assigned_user_ids.length !== 1 ? 's' : ''} selected</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-0 cursor-pointer text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors border-0 cursor-pointer text-sm">
                  {editing ? 'Update Task' : 'Create Task'}
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
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete Task</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            {taskToDelete && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{taskToDelete.title}</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setDeleteModal(false); setTaskToDelete(null); }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-0 cursor-pointer text-sm"
              >Cancel</button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-0 cursor-pointer text-sm"
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
