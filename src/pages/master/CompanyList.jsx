import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';

export const CompanyList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = async (company) => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      try {
        await apiService.request('delete', `/company/delete/${company.id}`);
        setRefreshKey(k => k + 1);
      } catch (error) {
        console.error('Failed to delete company:', error);
        alert(error.message || 'Failed to delete company');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCompany) {
        await apiService.request('patch', `/company/update/${editingCompany.id}`, formData);
      } else {
        await apiService.request('post', '/company/create', formData);
      }
      setIsModalOpen(false);
      setRefreshKey(k => k + 1);
    } catch (error) {
      console.error('Failed to save company:', error);
      alert(error.message || 'Failed to save company');
    }
  };

  return (
    <div className="companies-page">
      <ListView
        apiUrl="/company/view/all"
        refreshKey={refreshKey}
        title="Companies"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search company..."
        newButtonLabel="+ New Company"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompany ? "Edit Company" : "Create Company"}
      >
        <FormView
          fields={companyFields}
          initialValues={editingCompany || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingCompany ? "Update Company" : "Save Company"}
        />
      </Modal>
    </div>
  );
};

export default CompanyList;
