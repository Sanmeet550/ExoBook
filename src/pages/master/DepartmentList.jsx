import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const DepartmentList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formServerErrors, setFormServerErrors] = useState([]);

  const columns = [
    { key: 'name', label: 'Department Name' },
    {
      key: 'company_id',
      label: 'Company',
      render: (val) => {
        if (!val) return '-';
        const comp = companies.find((c) => String(c.id) === String(val));
        return comp ? comp.name : val;
      }
    }
  ];

  const departmentFields = [
    { name: 'name', label: 'Department Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. Human Resources, Sales, R&D' },
    { name: 'company_id', label: 'Company', type: 'select', required: true, gridSpan: 6, placeholder: 'Select Company', options: companies, optionLabel: 'name', optionValue: 'id' }
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/company/view/all`);
      setCompanies(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const handleNew = () => {
    setSelectedDepartment(null);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleRowClick = (dept) => {
    setSelectedDepartment(dept);
    setIsEditing(false);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEditRow = (dept) => {
    setSelectedDepartment(dept);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setFormServerErrors([]);
  };

  const handleDelete = async (row) => {
    const target = row || selectedDepartment;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete department ${target.name}?`)) {
      setFormServerErrors([]);
      try {
        await apiService.delete('department', target.id);
        setViewMode('list');
        setSelectedDepartment(null);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error('Error deleting department:', err);
        const errList = err?.errors || err?.response?.data?.errors || [{ field: 'id', message: err?.message || 'Deletion failed.' }];
        setFormServerErrors(errList);
        const firstMsg = errList[0]?.message || err?.message || 'Deletion failed.';
        alert(firstMsg);
      }
    }
  };

  const handleDiscard = () => {
    setFormServerErrors([]);
    if (selectedDepartment) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDepartment(null);
    setIsEditing(false);
    setFormServerErrors([]);
  };

  const handleSubmit = async (formData, { setServerErrors } = {}) => {
    setSaving(true);
    setFormServerErrors([]);
    try {
      if (selectedDepartment) {
        const updated = await apiService.update('department', selectedDepartment.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedDepartment, ...formData };
        setSelectedDepartment(updatedRecord);
      } else {
        const created = await apiService.create('department', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedDepartment(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving department:', err);
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
    <div className="departments-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/department/view/all"
          refreshKey={refreshKey}
          title="Departments"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search department..."
          newButtonLabel="+ New Department"
        />
      ) : (
        <FormView
          title={selectedDepartment ? selectedDepartment.name || 'Department Details' : 'New Department'}
          fields={departmentFields}
          initialValues={selectedDepartment || {}}
          serverErrors={formServerErrors}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedDepartment ? () => handleDelete(selectedDepartment) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedDepartment ? 'Update Department' : 'Save Department'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New Department"
        />
      )}
    </div>
  );
};

export default DepartmentList;
