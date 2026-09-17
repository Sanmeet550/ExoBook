import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const EmployeeList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formServerErrors, setFormServerErrors] = useState([]);

  const columns = [
    { key: 'name', label: 'Employee Name' },
    { key: 'work_email', label: 'Work Email' },
    { key: 'work_phone', label: 'Work Phone' },
    {
      key: 'department_id',
      label: 'Department',
      render: (val) => {
        if (!val) return '-';
        const d = departments.find((item) => String(item.id) === String(val));
        return d ? d.name : val;
      }
    },
    {
      key: 'job_position_id',
      label: 'Job Position',
      render: (val) => {
        if (!val) return '-';
        const j = jobPositions.find((item) => String(item.id) === String(val));
        return j ? j.name : val;
      }
    },
    {
      key: 'company_id',
      label: 'Company',
      render: (val) => {
        if (!val) return '-';
        const c = companies.find((item) => String(item.id) === String(val));
        return c ? c.name : val;
      }
    }
  ];

  const employeeFields = [
    { name: 'name', label: 'Full Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. John Doe' },
    { name: 'work_email', label: 'Work Email', type: 'email', gridSpan: 6, placeholder: 'e.g. john.doe@company.com' },
    { name: 'personal_email', label: 'Personal Email', type: 'email', gridSpan: 6, placeholder: 'e.g. john.personal@gmail.com' },
    { name: 'work_phone', label: 'Work Phone', type: 'text', gridSpan: 6, placeholder: 'e.g. +1 555-0199' },
    { name: 'personal_phone', label: 'Personal Phone', type: 'text', gridSpan: 6, placeholder: 'e.g. +1 555-0100' },
    { name: 'department_id', label: 'Department', type: 'select', gridSpan: 6, placeholder: 'Select Department', options: departments, optionLabel: 'name', optionValue: 'id' },
    { name: 'job_position_id', label: 'Job Position', type: 'select', gridSpan: 6, placeholder: 'Select Job Position', options: jobPositions, optionLabel: 'name', optionValue: 'id' },
    { name: 'company_id', label: 'Company', type: 'select', gridSpan: 6, placeholder: 'Select Company', options: companies, optionLabel: 'name', optionValue: 'id' },
    { name: 'manager_id', label: 'Manager', type: 'select', gridSpan: 6, placeholder: 'Select Manager', options: employees, optionLabel: 'name', optionValue: 'id' },
    { name: 'date_of_joining', label: 'Date of Joining', type: 'date', gridSpan: 6 },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      gridSpan: 6,
      placeholder: 'Select Gender',
      options: [
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' },
        { label: 'Other', value: 'Other' }
      ],
      optionLabel: 'label',
      optionValue: 'value'
    },
    { name: 'date_of_birth', label: 'Date of Birth', type: 'date', gridSpan: 6 },
    {
      name: 'marital_status',
      label: 'Marital Status',
      type: 'select',
      gridSpan: 6,
      placeholder: 'Select Marital Status',
      options: ['Single', 'Married', 'Divorced', 'Widowed']
    },
    { name: 'aadhar_no', label: 'Aadhar Number', type: 'text', gridSpan: 6, placeholder: 'Aadhar Number' },
    { name: 'pan_no', label: 'PAN Number', type: 'text', gridSpan: 6, placeholder: 'PAN Number' },
    { name: 'passport_number', label: 'Passport Number', type: 'text', gridSpan: 6, placeholder: 'Passport Number' },
    { name: 'bank_account_number', label: 'Bank Account Number', type: 'text', gridSpan: 6, placeholder: 'Bank Account Number' },
    { name: 'uan', label: 'UAN', type: 'text', gridSpan: 6, placeholder: 'UAN Number' },
    { name: 'esic_number', label: 'ESIC Number', type: 'text', gridSpan: 6, placeholder: 'ESIC Number' },
    { name: 'emergency_contact', label: 'Emergency Contact Phone', type: 'text', gridSpan: 6, placeholder: 'Emergency Contact Phone' },
    { name: 'contact_person_name', label: 'Emergency Contact Name', type: 'text', gridSpan: 6, placeholder: 'Contact Person Name' },
    { name: 'contact_relation', label: 'Emergency Contact Relation', type: 'text', gridSpan: 6, placeholder: 'e.g. Spouse, Parent' }
  ];

  useEffect(() => {
    fetchDepartments();
    fetchCompanies();
    fetchJobPositions();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/department/view/all`);
      setDepartments(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/company/view/all`);
      setCompanies(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const fetchJobPositions = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/job_position/view/all`);
      setJobPositions(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch job positions:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/employee/view/all`);
      setEmployees(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleNew = () => {
    setSelectedEmployee(null);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleRowClick = (emp) => {
    setSelectedEmployee(emp);
    setIsEditing(false);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEditRow = (emp) => {
    setSelectedEmployee(emp);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setFormServerErrors([]);
  };

  const handleDelete = async (row) => {
    const target = row || selectedEmployee;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete employee ${target.name}?`)) {
      setFormServerErrors([]);
      try {
        await apiService.delete('employee', target.id);
        setViewMode('list');
        setSelectedEmployee(null);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error('Error deleting employee:', err);
        const errList = err?.errors || err?.response?.data?.errors || [{ field: 'id', message: err?.message || 'Deletion failed.' }];
        setFormServerErrors(errList);
        const firstMsg = errList[0]?.message || err?.message || 'Deletion failed.';
        alert(firstMsg);
      }
    }
  };

  const handleDiscard = () => {
    setFormServerErrors([]);
    if (selectedEmployee) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedEmployee(null);
    setIsEditing(false);
    setFormServerErrors([]);
  };

  const handleSubmit = async (formData, { setServerErrors } = {}) => {
    setSaving(true);
    setFormServerErrors([]);
    try {
      if (selectedEmployee) {
        const updated = await apiService.update('employee', selectedEmployee.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedEmployee, ...formData };
        setSelectedEmployee(updatedRecord);
      } else {
        const created = await apiService.create('employee', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedEmployee(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving employee:', err);
      const errList = err?.errors || err?.response?.data?.errors;
      if (errList && setServerErrors) {
        setServerErrors(errList);
      } else if (errList) {
        setFormServerErrors(errList);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="employees-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/employee/view/all"
          refreshKey={refreshKey}
          title="Employees"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search employee by name or email..."
          newButtonLabel="+ New Employee"
        />
      ) : (
        <FormView
          title={selectedEmployee ? selectedEmployee.name || 'Employee Details' : 'New Employee'}
          fields={employeeFields}
          initialValues={selectedEmployee || {}}
          serverErrors={formServerErrors}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedEmployee ? () => handleDelete(selectedEmployee) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedEmployee ? 'Update Employee' : 'Save Employee'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New Employee"
        />
      )}
    </div>
  );
};

export default EmployeeList;
