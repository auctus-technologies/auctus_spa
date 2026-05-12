'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/ToastContext';
import { useAuth } from '../components/AuthContext';
import MinimalSelect from '@/components/MinimalSelect';
import { API_URL, BASE_URL } from '../endpoint/endpoint';


export default function UsersPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    fathersName: '',
    maritalStatus: '',
    bloodGroup: '',
    religion: '',
    personalMail: '',
    personalNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    employeeId: '',
    department: 'development',
    designation: 'software_engineer',
    dateOfJoining: '',
    dateOfLeaving: '',
    checkInTime: '',
    checkOutTime: '',
    profilePic: null,
    status: 'Active',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    loginEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const phoneInputRef = useRef(null);

  // Department options
  const departments = [
    { value: 'management', label: 'Management' },
    { value: 'development', label: 'Development' },
    { value: 'hr', label: 'Human Resources (HR)' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
  ];

  // Designations grouped by department
  const designationsByDept = {
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

  // All designations flat (for display in table)
  const designations = Object.values(designationsByDept).flat();


  useEffect(() => {
    if (phoneError && phoneInputRef.current) {
      phoneInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      phoneInputRef.current.focus();
    }
  }, [phoneError]);

  const fetchUsers = async (searchVal = searchTerm, deptVal = departmentFilter, pageVal = page) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: pageVal, page_size: PAGE_SIZE });
      if (searchVal) params.set('search', searchVal);
      if (deptVal && deptVal !== 'All') params.set('department', deptVal);
      const res = await fetch(`${API_URL}/employees?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.employees || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } else {
        console.error('Failed to fetch employees');
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchTerm, departmentFilter, page);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers(searchTerm, departmentFilter, 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, departmentFilter]);

  const openModal = () => {
    setEditMode(false);
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditMode(true);
    setEditingUserId(user._id || user.id);

    // Format date string (ISO or Date) → YYYY-MM-DD for input[type=date]
    const formatDate = (val) => {
      if (!val) return '';
      try {
        return new Date(val).toISOString().split('T')[0];
      } catch {
        return '';
      }
    };

    // Map DB status (lowercase) → dropdown option (proper case)
    const statusMap = { active: 'Active', inactive: 'Inactive', suspended: 'Inactive' };
    const mappedStatus = statusMap[user.status?.toLowerCase()] || 'Active';

    // Format blood group for display (a+ → A+, ab- → AB-)
    const formatBloodGroup = (bg) => {
      if (!bg) return '';
      return bg.toUpperCase().replace(/([ABO])([+-])/, (match, p1, p2) => {
        if (match === 'AB+' || match === 'AB-') return match;
        return p1 + p2;
      });
    };

    setFormData({
      fullName:       user.name                   || '',
      dateOfBirth:    formatDate(user.date_of_birth),
      gender:         user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : '',
      fathersName:    user.fathers_name           || '',
      maritalStatus:  user.marital_status ? user.marital_status.charAt(0).toUpperCase() + user.marital_status.slice(1) : '',
      bloodGroup:     formatBloodGroup(user.blood_group),
      religion:       user.religion               || '',
      personalMail:   user.email                  || '',
      personalNumber: user.phone                  || '',
      // address from nested object
      address:        user.address?.street          || '',
      city:           user.address?.city            || '',
      state:          user.address?.state           || '',
      zipCode:        user.address?.zip_code        || '',
      country:        user.address?.country         || '',
      employeeId:     user.employee_id            || '',
      department:     user.department             || '',
      designation:    user.designation            || '',
      // DB field is join_date, form field is dateOfJoining
      dateOfJoining:  formatDate(user.join_date),
      dateOfLeaving:  formatDate(user.date_of_leaving),
      checkInTime:    user.check_in_time          || '',
      checkOutTime:   user.check_out_time         || '',
      profilePic:     user.avatar_url ? `${BASE_URL}${user.avatar_url}` : (user.avatar || null),
      status:         mappedStatus,
      // bank from nested object
      accountNumber:  user.bank?.account_number   || '',
      bankName:       user.bank?.bank_name        || '',
      ifscCode:       user.bank?.ifsc_code        || '',
      loginEmail:     user.login_email            || '',
      password:       '',  // never pre-fill password
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleViewUser = (userId) => {
    router.push(`/dashboard/users/${userId}`);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    const deleteId = userToDelete._id || userToDelete.id;
    try {
      const res = await fetch(`${API_URL}/employees/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        await fetchUsers();
        closeDeleteModal();
        addToast('User deleted successfully', 'success');
      } else {
        const err = await res.json();
        addToast(err.error || 'Failed to delete user', 'error');
      }
    } catch {
      addToast('Network error while deleting user', 'error');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowPassword(false);
    setEditMode(false);
    setEditingUserId(null);
    setPhoneError('');
    setFormErrors({});
    setFormData({
      fullName: '', dateOfBirth: '', gender: '', fathersName: '',
      maritalStatus: '', bloodGroup: '', religion: '', personalMail: '',
      personalNumber: '', address: '', city: '', state: '', zipCode: '',
      country: '', employeeId: '', department: '', designation: '', dateOfJoining: '', dateOfLeaving: '',
      checkInTime: '', checkOutTime: '', profilePic: null, status: 'Active',
      accountNumber: '', bankName: '', ifscCode: '', loginEmail: '', password: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (name === 'department') {
      setFormData(prev => ({ ...prev, department: value, designation: '' }));
    } else if (name === 'checkInTime') {
      setFormData(prev => ({
        ...prev,
        checkInTime: value,
        checkOutTime: prev.checkOutTime && prev.checkOutTime <= value ? '' : prev.checkOutTime,
      }));
    } else {
      if (name === 'personalNumber') setPhoneError('');
      let sanitized = value;
      if (name === 'fullName' || name === 'fathersName' || name === 'religion') {
        sanitized = value.replace(/[^a-zA-Z\s\-'.]/g, '');
      } else if (name === 'accountNumber') {
        sanitized = value.replace(/\D/g, '');
      } else if (name === 'zipCode') {
        sanitized = value.replace(/\D/g, '').slice(0, 6);
      } else if (name === 'ifscCode') {
        sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
      } else if (name === 'personalNumber') {
        sanitized = value.replace(/[^\d\s\-+().]/g, '');
      }
      setFormData(prev => ({ ...prev, [name]: sanitized }));
    }
    if (formErrors[name]) setFormErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validateForm = () => {
    const errors = {};
    let phoneErr = '';

    const nameTrimmed = formData.fullName.trim();
    if (nameTrimmed.length < 2) {
      errors.fullName = 'Must be at least 2 characters';
    } else if (!/^[a-zA-Z\s\-'.]+$/.test(nameTrimmed)) {
      errors.fullName = "Only letters, spaces, hyphens and apostrophes allowed";
    }

    const fatherTrimmed = formData.fathersName.trim();
    if (fatherTrimmed.length < 2) {
      errors.fathersName = 'Must be at least 2 characters';
    } else if (!/^[a-zA-Z\s\-'.]+$/.test(fatherTrimmed)) {
      errors.fathersName = "Only letters, spaces, hyphens and apostrophes allowed";
    }

    const phoneTrimmed = formData.personalNumber.trim();
    const digits = phoneTrimmed.replace(/\D/g, '');
    if (phoneTrimmed && (!/^\+?[\d\s\-().]{7,20}$/.test(phoneTrimmed) || digits.length < 7 || digits.length > 15)) {
      phoneErr = 'Enter a valid phone number (7–15 digits)';
    }

    const zipTrimmed = formData.zipCode.trim();
    if (zipTrimmed && !/^\d{4,6}$/.test(zipTrimmed)) {
      errors.zipCode = 'Enter a valid ZIP code (4–6 digits)';
    }

    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const ageYears = (today - dob) / (365.25 * 24 * 60 * 60 * 1000);
      if (dob >= today) {
        errors.dateOfBirth = 'Date of birth must be in the past';
      } else if (ageYears < 16) {
        errors.dateOfBirth = 'Employee must be at least 16 years old';
      } else if (ageYears > 80) {
        errors.dateOfBirth = 'Enter a valid date of birth';
      }
    }

    if (formData.accountNumber.trim() && !/^\d{9,18}$/.test(formData.accountNumber.trim())) {
      errors.accountNumber = 'Account number must be 9–18 digits only';
    }

    if (formData.ifscCode.trim() && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifscCode.trim())) {
      errors.ifscCode = 'Invalid IFSC code (e.g., HDFC0001234)';
    }

    if (!editMode) {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }

    return { errors, phoneErr };
  };

  const validateField = (name) => {
    const value = formData[name] || '';
    switch (name) {
      case 'fullName':
      case 'fathersName': {
        const t = value.trim();
        if (t.length < 2) return 'Must be at least 2 characters';
        if (!/^[a-zA-Z\s\-'.]+$/.test(t)) return 'Only letters, spaces, hyphens and apostrophes allowed';
        return '';
      }
      case 'dateOfBirth': {
        if (!value) return '';
        const dob = new Date(value);
        const today = new Date();
        const age = (today - dob) / (365.25 * 24 * 60 * 60 * 1000);
        if (dob >= today) return 'Date of birth must be in the past';
        if (age < 16) return 'Employee must be at least 16 years old';
        if (age > 80) return 'Enter a valid date of birth';
        return '';
      }
      case 'personalNumber': {
        const t = value.trim();
        const d = t.replace(/\D/g, '');
        if (t && (!/^\+?[\d\s\-().]{7,20}$/.test(t) || d.length < 7 || d.length > 15))
          return 'Enter a valid phone number (7–15 digits)';
        return '';
      }
      case 'zipCode': {
        const t = value.trim();
        if (t && !/^\d{4,6}$/.test(t)) return 'Enter a valid ZIP code (4–6 digits)';
        return '';
      }
      case 'accountNumber': {
        const t = value.trim();
        if (t && !/^\d{9,18}$/.test(t)) return 'Account number must be 9–18 digits only';
        return '';
      }
      case 'ifscCode': {
        const t = value.trim();
        if (t && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(t)) return 'Invalid IFSC code (e.g., HDFC0001234)';
        return '';
      }
      case 'password': {
        if (editMode) return '';
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      }
      default: return '';
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name === 'personalNumber') {
      const err = validateField('personalNumber');
      setPhoneError(err);
      return;
    }
    const err = validateField(name);
    setFormErrors(prev => {
      const next = { ...prev };
      if (err) next[name] = err;
      else delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { errors, phoneErr } = validateForm();
      setPhoneError(phoneErr);
      setFormErrors(errors);
      if (phoneErr || Object.keys(errors).length > 0) return;

      // Convert profile picture File → base64 if needed
      let avatarBase64 = null;
      if (formData.profilePic && typeof formData.profilePic !== 'string') {
        const reader = new FileReader();
        avatarBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(formData.profilePic);
        });
      }

      // For edit, send all fields including address, bank and avatar
      const editPayload = {
        name:           formData.fullName,
        email:          formData.personalMail,
        login_email:    formData.loginEmail,
        employee_id:    formData.employeeId, // Keep existing employee_id
        department:     formData.department,
        designation:    formData.designation,
        status:         formData.status,
        phone:          formData.personalNumber,
        date_of_birth:  formData.dateOfBirth || null,
        gender:         formData.gender?.toLowerCase() || null,
        fathers_name:   formData.fathersName || null,
        marital_status: formData.maritalStatus?.toLowerCase() || null,
        blood_group:    formData.bloodGroup?.toLowerCase() || null,
        religion:       formData.religion || null,
        check_in_time:  formData.checkInTime || null,
        check_out_time: formData.checkOutTime || null,
        date_of_leaving: formData.dateOfLeaving || null,
        avatar_base64:  avatarBase64 || (formData.profilePic && typeof formData.profilePic === 'string' ? formData.profilePic : null),
        address: {
          street:  formData.address || '',
          city:    formData.city || '',
          state:   formData.state || '',
          zip_code: formData.zipCode || '',
          country: formData.country || ''
        },
        bank: {
          account_number: formData.accountNumber || '',
          bank_name:      formData.bankName || '',
          ifsc_code:      formData.ifscCode || ''
        }
      };

      if (editMode) {
        const res = await fetch(`${API_URL}/employees/${editingUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(editPayload),
        });
        if (res.ok) {
          await fetchUsers();
          closeModal();
          addToast('User updated successfully', 'success');
        } else {
          const err = await res.json();
          const msg = err.error || 'Failed to update user';
          if (msg.toLowerCase().includes('phone')) {
            setPhoneError(msg);
          } else {
            addToast(msg, 'error');
          }
        }
      } else {
        // Create employee using the employees endpoint (auto-generates employee_id)
        const employeePayload = {
          name: formData.fullName,
          email: formData.personalMail,
          login_email: formData.loginEmail,
          password: formData.password,
          // employee_id is auto-generated by backend
          department: formData.department,
          designation: formData.designation,
          phone: formData.personalNumber,
          date_of_birth: formData.dateOfBirth || null,
          gender: formData.gender?.toLowerCase() || null,
          fathers_name: formData.fathersName || null,
          marital_status: formData.maritalStatus?.toLowerCase() || null,
          blood_group: formData.bloodGroup?.toLowerCase() || null,
          religion: formData.religion || null,
          check_in_time: formData.checkInTime || null,
          check_out_time: formData.checkOutTime || null,
          avatar_base64: avatarBase64 || (formData.profilePic && typeof formData.profilePic === 'string' ? formData.profilePic : null),
          address: {
            street: formData.address || '',
            city: formData.city || '',
            state: formData.state || '',
            zip_code: formData.zipCode || '',
            country: formData.country || ''
          },
          bank: {
            account_number: formData.accountNumber || '',
            bank_name: formData.bankName || '',
            ifsc_code: formData.ifscCode || ''
          }
        };
        const res = await fetch(`${API_URL}/employees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(employeePayload),
        });
        if (res.ok) {
          await fetchUsers();
          closeModal();
          addToast('User created successfully', 'success');
        } else {
          const err = await res.json();
          const msg = err.error || 'Failed to create user';
          if (msg.toLowerCase().includes('phone')) {
            setPhoneError(msg);
          } else {
            addToast(msg, 'error');
          }
        }
      }
    } catch {
      addToast('Network error while saving user', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm";

  return (
    <div className="w-full">
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 m-0">Users</h1>
        <p className="text-sm text-gray-400 mt-1 mb-0">Manage your team members and their permissions.</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <MinimalSelect value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} wrapperClassName="max-w-[180px]">
              <option value="All">All Departments</option>
              {departments.map(dept => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </MinimalSelect>
          </div>
          <button onClick={openModal} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors border-0 cursor-pointer whitespace-nowrap">
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800 m-0">All Users</h2>
          <span className="text-xs text-gray-400">{total} found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['S.No','Profile','Name','Employee ID','Email','Department','Designation','Actions'].map(h => (
                  <th key={h} className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-primary" />
                    Loading users...
                  </div>
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-500">No users found</td></tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewUser(user._id || user.id)}>
                    <td className="px-3 py-2 text-sm text-gray-600 text-center">{(page - 1) * PAGE_SIZE + index + 1}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold mx-auto overflow-hidden">
                        {user.avatar_url ? (
                          <img src={`${BASE_URL}${user.avatar_url}`} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0)?.toUpperCase() || '?'
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center"><p className="text-sm font-medium text-gray-800 m-0 capitalize">{user.name}</p></td>
                    <td className="px-3 py-2 text-sm text-gray-600 text-center">{user.employee_id || '—'}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 text-center">{user.email}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 text-center">
                      {departments.find(d => d.value === user.department)?.label || user.department || '—'}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-600 text-center">
                      {designations.find(d => d.value === user.designation)?.label || user.designation || '—'}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <button onClick={(e) => { e.stopPropagation(); handleViewUser(user._id || user.id); }} className="text-blue-600 hover:text-blue-700 border-0 bg-transparent cursor-pointer p-1.5 rounded hover:bg-gray-50" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); openEditModal(user); }} className="text-primary hover:text-primary-dark border-0 bg-transparent cursor-pointer p-1.5 rounded hover:bg-gray-50" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); openDeleteModal(user); }} className="text-red-600 hover:text-red-700 border-0 bg-transparent cursor-pointer p-1.5 rounded hover:bg-gray-50" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min((page - 1) * PAGE_SIZE + PAGE_SIZE, total)} of {total} users
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

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 m-0">{editMode ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none border-0 bg-transparent cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} onBlur={handleBlur} required className={`${inputCls} ${formErrors.fullName ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`} placeholder="Enter full name" />
                    {formErrors.fullName && <p className="mt-1 text-xs text-red-500">{formErrors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} onBlur={handleBlur} required className={`${inputCls} ${formErrors.dateOfBirth ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`} />
                    {formErrors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{formErrors.dateOfBirth}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                    <MinimalSelect name="gender" value={formData.gender} onChange={handleInputChange} required>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </MinimalSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name <span className="text-red-500">*</span></label>
                    <input type="text" name="fathersName" value={formData.fathersName} onChange={handleInputChange} onBlur={handleBlur} required className={`${inputCls} ${formErrors.fathersName ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`} placeholder="Enter father's name" />
                    {formErrors.fathersName && <p className="mt-1 text-xs text-red-500">{formErrors.fathersName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status <span className="text-red-500">*</span></label>
                    <MinimalSelect name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} required>
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </MinimalSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group <span className="text-red-500">*</span></label>
                    <MinimalSelect name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} required>
                      <option value="">Select Blood Group</option>
                      {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                    </MinimalSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Religion <span className="text-red-500">*</span></label>
                    <input type="text" name="religion" value={formData.religion} onChange={handleInputChange} required className={inputCls} placeholder="Enter religion" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                    <div className="relative">
                      <input type="file" name="profilePic" onChange={handleInputChange} accept="image/*" className="hidden" id="profilePicInput" />
                      <label htmlFor="profilePicInput" className="flex items-center justify-between w-full px-3 py-2 border border-gray-200 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors">
                        <span className="text-sm text-gray-600 truncate">
                          {formData.profilePic ? (typeof formData.profilePic === 'string' ? 'Current image' : formData.profilePic.name) : 'Choose file'}
                        </span>
                        <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      </label>
                    </div>
                    {/* Image Preview */}
                    {formData.profilePic && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                          <img 
                            src={typeof formData.profilePic === 'string' ? formData.profilePic : URL.createObjectURL(formData.profilePic)} 
                            alt="Profile preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {typeof formData.profilePic === 'string' ? 'Saved image' : 'New image'}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG or any image format</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Personal Mail <span className="text-red-500">*</span></label>
                    <input type="email" name="personalMail" value={formData.personalMail} onChange={handleInputChange} required className={inputCls} placeholder="personal@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Personal Number <span className="text-red-500">*</span></label>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      name="personalNumber"
                      value={formData.personalNumber}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      className={`${inputCls} ${phoneError ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
                      placeholder="+1234567890"
                    />
                    {phoneError && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {phoneError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className={inputCls} placeholder="Enter street address" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className={inputCls} placeholder="Enter city" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className={inputCls} placeholder="Enter state" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code <span className="text-red-500">*</span></label>
                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} onBlur={handleBlur} required inputMode="numeric" maxLength={6} className={`${inputCls} ${formErrors.zipCode ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`} placeholder="Enter ZIP code" />
                    {formErrors.zipCode && <p className="mt-1 text-xs text-red-500">{formErrors.zipCode}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} required className={inputCls} placeholder="Enter country" />
                  </div>
                </div>
              </div>

              {/* Employment */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {editMode ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                      <input type="text" name="employeeId" value={formData.employeeId} readOnly className={`${inputCls} bg-gray-100 cursor-not-allowed`} />
                      <p className="text-xs text-gray-400 mt-1">Auto-generated</p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                      <div className={`${inputCls} bg-gray-50 text-gray-500 flex items-center`}>
                        <span className="text-xs">Auto-generated (EMP_XX)</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
                    <MinimalSelect name="department" value={formData.department} onChange={handleInputChange} required>
                      <option value="">Select department</option>
                      {departments.map(dept => <option key={dept.value} value={dept.value}>{dept.label}</option>)}
                    </MinimalSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation <span className="text-red-500">*</span></label>
                    <MinimalSelect name="designation" value={formData.designation} onChange={handleInputChange} required>
                      <option value="">Select designation</option>
                      {(designationsByDept[formData.department] || []).map(desig => <option key={desig.value} value={desig.value}>{desig.label}</option>)}
                    </MinimalSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining <span className="text-red-500">*</span></label>
                    <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleInputChange} required className={inputCls} />
                  </div>
                  {editMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Leaving</label>
                      <input type="date" name="dateOfLeaving" value={formData.dateOfLeaving} onChange={handleInputChange} className={inputCls} />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check In Time <span className="text-red-500">*</span></label>
                    <input type="time" name="checkInTime" value={formData.checkInTime} onChange={handleInputChange} required className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check Out Time <span className="text-red-500">*</span></label>
                    <input type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleInputChange} required min={formData.checkInTime || undefined} className={inputCls} />
                  </div>
                  {editMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <MinimalSelect name="status" value={formData.status} onChange={handleInputChange}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </MinimalSelect>
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Details */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Bank Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} onBlur={handleBlur} inputMode="numeric" maxLength={18} className={`${inputCls} ${formErrors.accountNumber ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`} placeholder="Enter account number" />
                    {formErrors.accountNumber && <p className="mt-1 text-xs text-red-500">{formErrors.accountNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className={inputCls} placeholder="Enter bank name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                    <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} onBlur={handleBlur} maxLength={11} className={`${inputCls} ${formErrors.ifscCode ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`} placeholder="Enter IFSC code" />
                    {formErrors.ifscCode && <p className="mt-1 text-xs text-red-500">{formErrors.ifscCode}</p>}
                  </div>
                </div>
              </div>

              {/* Login Details — new users only */}
              {!editMode && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Login Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Login Email</label>
                      <input type="email" name="loginEmail" value={formData.loginEmail} onChange={handleInputChange} required className={inputCls} placeholder="login@company.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} onBlur={handleBlur} required className={`${inputCls} pr-10 ${formErrors.password ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`} placeholder="Enter password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 border-0 bg-transparent cursor-pointer">
                          {showPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          )}
                        </button>
                      </div>
                      {formErrors.password && <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={closeModal} disabled={isSubmitting} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm border-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      {editMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editMode ? 'Update User' : 'Add User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 m-0">Delete User</h2>
              <button onClick={closeDeleteModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none border-0 bg-transparent cursor-pointer">×</button>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-600 m-0">Are you sure you want to delete <span className="font-semibold text-gray-900">{userToDelete?.name}</span>?</p>
              <p className="text-xs text-gray-400 mt-2 mb-0">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={closeDeleteModal} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm border-0">Delete User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}