import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const JobPositionList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formServerErrors, setFormServerErrors] = useState([]);

  const columns = [
    { key: 'name', label: 'Job Position Name' },
    {
      key: 'department_id',
      label: 'Department',
      render: (val) => {
        if (!val) return '-';
        const dept = departments.find((d) => String(d.id) === String(val));
        return dept ? dept.name : val;
      }
    },
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

  const jobPositionFields = [
    { name: 'name', label: 'Job Position Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. Software Engineer' },
    { name: 'department_id', label: 'Department', type: 'select', required: true, gridSpan: 6, placeholder: 'Select Department', options: departments, optionLabel: 'name', optionValue: 'id' },
    { name: 'company_id', label: 'Company', type: 'select', required: true, gridSpan: 6, placeholder: 'Select Company', options: companies, optionLabel: 'name', optionValue: 'id' }
  ];

  useEffect(() => {
    fetchDepartments();
    fetchCompanies();
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

  const handleNew = () => {
    setSelectedJob(null);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleRowClick = (job) => {
    setSelectedJob(job);
    setIsEditing(false);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEditRow = (job) => {
    setSelectedJob(job);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setFormServerErrors([]);
  };

  const handleDelete = async (row) => {
    const target = row || selectedJob;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete job position ${target.name}?`)) {
      setFormServerErrors([]);
      try {
        await apiService.delete('job_position', target.id);
        setViewMode('list');
        setSelectedJob(null);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error('Error deleting job position:', err);
        const errList = err?.errors || err?.response?.data?.errors || [{ field: 'id', message: err?.message || 'Deletion failed.' }];
        setFormServerErrors(errList);
        const firstMsg = errList[0]?.message || err?.message || 'Deletion failed.';
        alert(firstMsg);
      }
    }
  };

  const handleDiscard = () => {
    setFormServerErrors([]);
    if (selectedJob) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedJob(null);
    setIsEditing(false);
    setFormServerErrors([]);
  };

  const handleSubmit = async (formData, { setServerErrors } = {}) => {
    setSaving(true);
    setFormServerErrors([]);
    try {
      if (selectedJob) {
        const updated = await apiService.update('job_position', selectedJob.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedJob, ...formData };
        setSelectedJob(updatedRecord);
      } else {
        const created = await apiService.create('job_position', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedJob(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving job position:', err);
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
    <div className="job-positions-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/job_position/view/all"
          refreshKey={refreshKey}
          title="Job Positions"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search job position..."
          newButtonLabel="+ New Job Position"
        />
      ) : (
        <FormView
          title={selectedJob ? selectedJob.name || 'Job Position Details' : 'New Job Position'}
          fields={jobPositionFields}
          initialValues={selectedJob || {}}
          serverErrors={formServerErrors}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedJob ? () => handleDelete(selectedJob) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedJob ? 'Update Job Position' : 'Save Job Position'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New Job Position"
        />
      )}
    </div>
  );
};

export default JobPositionList;
