import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';

export const CompanyList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'Company Name' },
    { key: 'email', label: 'Email' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'city', label: 'City' }
  ];

  const companyFields = [
    { name: 'name', label: 'Company Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. Acme Corp' },
    { name: 'email', label: 'Email Address', type: 'email', gridSpan: 6, placeholder: 'e.g. info@acme.com' },
    { name: 'mobile', label: 'Mobile Number', type: 'text', gridSpan: 6, placeholder: 'e.g. +123456789' },
    { name: 'city', label: 'City', type: 'text', gridSpan: 6, placeholder: 'e.g. New York' }
  ];

  const handleNew = () => {
    setSelectedCompany(null);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleRowClick = (company) => {
    setSelectedCompany(company);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleEditRow = (company) => {
    setSelectedCompany(company);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async (company) => {
    const target = company || selectedCompany;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete ${target.name}?`)) {
      try {
        await apiService.request('delete', `/company/delete/${target.id}`);
        setViewMode('list');
        setSelectedCompany(null);
        setRefreshKey((k) => k + 1);
      } catch (error) {
        console.error('Failed to delete company:', error);
        alert(error.message || 'Failed to delete company');
      }
    }
  };

  const handleDiscard = () => {
    if (selectedCompany) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCompany(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (selectedCompany) {
        const res = await apiService.request('patch', `/company/update/${selectedCompany.id}`, formData);
        const updatedRecord = (res && res.id) ? res : { ...selectedCompany, ...formData };
        setSelectedCompany(updatedRecord);
      } else {
        const res = await apiService.request('post', '/company/create', formData);
        const newRecord = (res && res.id) ? res : { ...formData };
        setSelectedCompany(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error('Failed to save company:', error);
      alert(error.message || 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="companies-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/company/view/all"
          refreshKey={refreshKey}
          title="Companies"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search company..."
          newButtonLabel="+ New Company"
        />
      ) : (
        <FormView
          title={selectedCompany ? selectedCompany.name || 'Company Details' : 'New Company'}
          fields={companyFields}
          initialValues={selectedCompany || {}}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedCompany ? () => handleDelete(selectedCompany) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedCompany ? 'Update Company' : 'Save Company'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New Company"
        />
      )}
    </div>
  );
};

export default CompanyList;
