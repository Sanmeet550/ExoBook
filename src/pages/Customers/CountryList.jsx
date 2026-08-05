import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';

export const CountryList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'name', label: 'Country Name' },
    { key: 'code', label: 'ISO Code' },
    { key: 'phoneCode', label: 'Phone Dial Code' }
  ];

  const countryFields = [
    { name: 'name', label: 'Country Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. India' },
    { name: 'code', label: 'Country Code', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. IN' },
    { name: 'phoneCode', label: 'Phone Dial Code', type: 'text', required: true, gridSpan: 12, placeholder: 'e.g. +91' }
  ];

  const handleNew = () => {
    setEditingCountry(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingCountry(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      await apiService.delete('country', row.id);
      setRefreshKey(k => k + 1);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingCountry) {
      await apiService.update('country', editingCountry.id, formData);
    } else {
      await apiService.create('country', formData);
    }
    setIsModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="countries-page">
      <ListView
        apiUrl="/country/view/all"
        refreshKey={refreshKey}
        title="Countries"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search country..."
        newButtonLabel="+ New Country"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCountry ? "Edit Country" : "Create Country"}
      >
        <FormView
          fields={countryFields}
          initialValues={editingCountry || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingCountry ? "Update Country" : "Save Country"}
        />
      </Modal>
    </div>
  );
};

export default CountryList;
