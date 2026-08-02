import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import { initialCountries } from '../../services/mockData';

export const CountryList = () => {
  const [countries, setCountries] = useState(initialCountries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);

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

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      setCountries(prev => prev.filter(c => c.id !== row.id));
    }
  };

  const handleSubmit = (formData) => {
    if (editingCountry) {
      setCountries(prev => prev.map(c => c.id === editingCountry.id ? { ...c, ...formData } : c));
    } else {
      setCountries(prev => [{ id: Date.now(), ...formData }, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="countries-page">
      <ListView
        title="Countries"
        columns={columns}
        data={countries}
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
