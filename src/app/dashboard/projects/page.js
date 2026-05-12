'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/ToastContext';
import { API_URL } from '../endpoint/endpoint';
import FileViewerModal from '../components/FileViewerModal';
import MinimalSelect from '@/components/MinimalSelect';

const ProjectsPage = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    description: '',
    requirements: '',
    team_ids: [],
    startDate: '',
    endDate: '',
    status: 'Planning',
    existingAttachments: [],
    newFiles: []
  });
  const fileInputRef = useRef(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchClients();
    fetchTeamMembers();
  }, []);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // Fetch with debounce on search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects(search, statusFilter, page);
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, statusFilter, page]);

  const fetchProjects = async (searchVal = '', statusVal = 'All', pageVal = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchVal) params.set('search', searchVal);
      if (statusVal && statusVal !== 'All') params.set('status', statusVal);
      params.set('page', pageVal);
      params.set('page_size', PAGE_SIZE);

      const res = await fetch(`${API_URL}/projects?${params}`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        const projectsArray = data.projects || [];
        // Transform backend data to match frontend format
        const transformedProjects = projectsArray.map(project => ({
          id: project.id,
          name: project.name,
          client: project.client_name,
          client_id: project.client_id,
          description: project.description || '',
          requirements: project.requirements || '',
          team: project.team_member_names || [],
          team_ids: project.team_members || [],
          startDate: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '',
          endDate: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : '',
          status: project.status,
          attachments: project.attachments || [],
          createdBy: project.created_by || null
        }));
        setProjects(transformedProjects);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setError('Network error while fetching projects');
      console.error('Fetch projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const [clientsList, setClientsList] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_URL}/clients-for-projects`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setClientsList(data.map(c => ({ id: c.id, name: c.name, company: c.company })));
      }
    } catch (err) {
      console.error('Fetch clients error:', err);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch(`${API_URL}/team-members`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data.members.map(m => ({ id: m.id, name: m.name, designation: m.designation || null })));
      }
    } catch (err) {
      console.error('Fetch team members error:', err);
    }
  };


  const statusOptions = ['Planning', 'Progress', 'Testing', 'Completed', 'On Hold'];

  const designationLabels = {
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

  const getMemberLabel = (member) => {
    const desig = member.designation ? designationLabels[member.designation] || member.designation : null;
    return desig ? `${member.name}(${desig})` : member.name;
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      client_id: '',
      description: '',
      requirements: '',
      team_ids: [],
      startDate: '',
      endDate: '',
      status: 'Planning',
      existingAttachments: [],
      newFiles: []
    });
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      client_id: project.client_id || '',
      description: project.description || '',
      requirements: project.requirements || '',
      team_ids: project.team_ids || [],
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      // Store existing attachments separately from new files
      existingAttachments: project.attachments || [],
      newFiles: []
    });
    setShowModal(true);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('API_URL:', API_URL);
    console.log('formData:', formData);
    
    try {
      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData();
      
      // Add individual form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('client_id', formData.client_id);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('requirements', formData.requirements || '');
      formDataToSend.append('start_date', formData.startDate);
      formDataToSend.append('end_date', formData.endDate);
      formDataToSend.append('status', formData.status);
      
      // Add team members as individual fields
      if (formData.team_ids && formData.team_ids.length > 0) {
        formData.team_ids.forEach((id) => {
          formDataToSend.append('team_members', id);
        });
      }
      
      // Add new files if any
      if (formData.newFiles && formData.newFiles.length > 0) {
        formData.newFiles.forEach((file) => {
          formDataToSend.append('files', file);
        });
      }

      // Send removed attachment IDs when editing
      if (editingProject) {
        const originalIds = (editingProject.attachments || []).map(a => a.id);
        const remainingIds = (formData.existingAttachments || []).map(a => a.id);
        const removedIds = originalIds.filter(id => !remainingIds.includes(id));
        removedIds.forEach(id => formDataToSend.append('removed_attachment_ids', id));
      }

      console.log('Sending form data:', Object.fromEntries(formDataToSend));

      if (editingProject) {
        // Update existing project
        const res = await fetch(`${API_URL}/projects/${editingProject.id}`, {
          method: 'PUT',
          credentials: 'include',
          body: formDataToSend
        });

        if (res.ok) {
          addToast('Project updated successfully', 'success');
          await fetchProjects(search, statusFilter, page);
        } else {
          const error = await res.json();
          console.error('Update error:', error);
          addToast(error.detail?.[0]?.msg || error.error || 'Failed to update project', 'error');
        }
      } else {
        // Create new project
        console.log('Creating project at:', `${API_URL}/projects`);
        const res = await fetch(`${API_URL}/projects`, {
          method: 'POST',
          credentials: 'include',
          body: formDataToSend
        });

        console.log('Response status:', res.status);
        
        if (res.ok) {
          const newProject = await res.json();
          console.log('Created project:', newProject);
          addToast('Project created successfully', 'success');
          await fetchProjects(search, statusFilter, 1);
          setPage(1);
        } else {
          const error = await res.json();
          console.error('Create error:', error);
          addToast(error.detail?.[0]?.msg || error.error || 'Failed to create project', 'error');
        }
      }
      
      setShowModal(false);
      setEditingProject(null);
    } catch (err) {
      addToast('Network error while saving project', 'error');
      console.error('Save project error:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePreview = (attachment, projectId) => {
    setPreviewAttachment(attachment);
    setPreviewProjectId(projectId);
  };

  const handleClosePreview = () => {
    setPreviewAttachment(null);
    setPreviewProjectId(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Progress': return 'bg-blue-100 text-blue-700';
      case 'Planning': return 'bg-yellow-100 text-yellow-700';
      case 'Testing': return 'bg-purple-100 text-purple-700';
      case 'On Hold': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [previewProjectId, setPreviewProjectId] = useState(null);

  const indexOfFirstItem = (page - 1) * PAGE_SIZE;

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        const res = await fetch(`${API_URL}/projects/${projectToDelete.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (res.ok) {
          addToast('Project deleted successfully', 'success');
          await fetchProjects(search, statusFilter, page);
        } else {
          const error = await res.json();
          addToast(error.error || 'Failed to delete project', 'error');
        }
      } catch (err) {
        addToast('Network error while deleting project', 'error');
        console.error('Delete project error:', err);
      }
      setDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Projects</h1>
        </div>
        <button
          onClick={handleAddProject}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Project
        </button>
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
                placeholder="Search projects, clients..."
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
            {/* Status filter */}
            <MinimalSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              wrapperClassName="w-44"
            >
              <option value="All">All Statuses</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </MinimalSelect>
          </div>
          <p className="text-xs text-gray-400 shrink-0">{total} project{total !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Project Name</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Created By</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-primary"/>
                    Loading projects…
                  </div>
                </td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">
                  {search || statusFilter !== 'All' ? 'No projects match your filters.' : 'No projects yet.'}
                </td></tr>
              ) : projects.map((project, index) => (
                <tr key={project.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/dashboard/projects/${project.id}`)}>
                  <td className="px-5 py-4 text-center">
                    <div className="text-sm font-medium text-gray-800">{indexOfFirstItem + index + 1}</div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="text-sm font-medium text-gray-800">{project.name}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 text-center">{project.client}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 text-center">{formatDate(project.startDate)} - {formatDate(project.endDate)}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 text-center">{project.createdBy || '—'}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/projects/${project.id}`); }}
                        className="text-blue-600 hover:text-blue-700 border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors"
                        title="View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditProject(project); }}
                        className="text-primary hover:text-primary-dark border-0 bg-transparent cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(project); }}
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
              Showing {total === 0 ? 0 : indexOfFirstItem + 1}–{Math.min(indexOfFirstItem + PAGE_SIZE, total)} of {total} projects
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter project name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <MinimalSelect
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </MinimalSelect>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <MinimalSelect
                  required
                  value={formData.client_id || ''}
                  onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                >
                  <option value="">Select Client</option>
                  {clientsList.map(client => (
                    <option key={client.id} value={client.id}>{client.name} {client.company ? `(${client.company})` : ''}</option>
                  ))}
                </MinimalSelect>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Enter project description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea
                  rows="3"
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Enter project requirements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                <div className="border border-gray-200 rounded-lg p-3">
                  <label className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17,8 12,3 7,8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Choose Files
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files);
                        if (newFiles.length > 0) {
                          setFormData({...formData, newFiles: [...formData.newFiles, ...newFiles]});
                        }
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    />
                  </label>
                  <span className="ml-3 text-sm text-gray-600">
                    {(formData.existingAttachments?.length || 0) + (formData.newFiles?.length || 0) > 0 
                      ? `${(formData.existingAttachments?.length || 0) + (formData.newFiles?.length || 0)} file(s) selected` 
                      : 'No file chosen'}
                  </span>
                  
                  {/* Existing Attachments (from backend) */}
                  {formData.existingAttachments?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.existingAttachments.map((att, index) => (
                        <div key={`existing-${index}`} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* File Icon */}
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                              </svg>
                            </div>
                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-800 truncate">{att.file_name || att.name}</div>
                              <div className="text-xs text-gray-500">
                                {formatFileSize(att.file_size)}
                                {att.uploaded_at && (
                                  <span> • Uploaded {formatDateTime(att.uploaded_at)}</span>
                                )}
                                {att.uploaded_by && (
                                  <span> by {att.uploaded_by}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Preview/Download Button */}
                            <button
                              type="button"
                              onClick={() => handlePreview(att, editingProject?.id)}
                              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                              title="View / Download"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                              </svg>
                            </button>
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const newExisting = formData.existingAttachments.filter((_, i) => i !== index);
                                setFormData({...formData, existingAttachments: newExisting});
                              }}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* New Files (to be uploaded) */}
                  {formData.newFiles?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">New Files:</p>
                      <div className="space-y-1">
                        {formData.newFiles.map((file, index) => (
                          <div key={`new-${index}`} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                                </svg>
                                <span className="truncate">{file.name}</span>
                              </div>
                              <div className="text-xs text-gray-400 ml-6">
                                {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = formData.newFiles.filter((_, i) => i !== index);
                                setFormData({...formData, newFiles});
                              }}
                              className="text-red-500 hover:text-red-700 ml-2 cursor-pointer flex-shrink-0"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {(formData.existingAttachments?.length || 0) + (formData.newFiles?.length || 0) === 0 && (
                    <p className="mt-2 text-sm text-gray-500 italic">No files selected</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {teamMembers.map(member => (
                    <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.team_ids?.includes(member.id)}
                        onChange={() => {
                          const currentIds = formData.team_ids || [];
                          setFormData({
                            ...formData,
                            team_ids: currentIds.includes(member.id)
                              ? currentIds.filter(id => id !== member.id)
                              : [...currentIds, member.id]
                          });
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{getMemberLabel(member)}</span>
                    </label>
                  ))}
                </div>
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
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors border-0 cursor-pointer"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
                <p className="text-sm text-gray-600">Are you sure you want to delete this project?</p>
              </div>
            </div>
            
            {projectToDelete && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{projectToDelete.name}</p>
                <p className="text-xs text-gray-600 mt-1">{projectToDelete.description}</p>
              </div>
            )}
            
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-0 cursor-pointer"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      <FileViewerModal
        isOpen={!!previewAttachment}
        onClose={handleClosePreview}
        attachment={previewAttachment}
        projectId={previewProjectId}
      />
    </div>
  );
};

export default ProjectsPage;
