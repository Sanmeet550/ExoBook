import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const CustomerList = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'form'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    {
      key: 'country',
      label: 'Country',
      render: (val, row) => {
        if (row.country_id) {
          const c = countries.find((item) => String(item.id) === String(row.country_id));
          if (c) return c.name;
        }
        return val || '-';
      }
    },
    {
      key: 'state',
      label: 'State',
      render: (val, row) => {
        if (row.state_id) {
          const s = states.find((item) => String(item.id) === String(row.state_id));
          if (s) return s.name;
        }
        return val || '-';
      }
    }
  ];

  const customerFields = [
    { name: 'name', label: 'Customer Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. ABC Store' },
    { name: 'phone', label: 'Phone Number', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. 9876543210' },
    { name: 'email', label: 'Email Address', type: 'email', gridSpan: 6, placeholder: 'e.g. info@abc.com' },
    { name: 'country_id', label: 'Country', type: 'select', options: countries, required: true, gridSpan: 6, optionLabel: 'name', optionValue: 'id' },
    { name: 'state_id', label: 'State', type: 'select', options: states, gridSpan: 6, optionLabel: 'name', optionValue: 'id' }
  ];

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/state/view/all`);
      setStates(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/country/view/all`);
      setCountries(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const handleNew = () => {
    setSelectedCustomer(null);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleEditRow = (customer) => {
    setSelectedCustomer(customer);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async (customer) => {
    const target = customer || selectedCustomer;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete ${target.name}?`)) {
      await apiService.delete('partner', target.id);
      setViewMode('list');
      setSelectedCustomer(null);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleDiscard = () => {
    if (selectedCustomer) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCustomer(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (selectedCustomer) {
        const updated = await apiService.update('partner', selectedCustomer.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedCustomer, ...formData };
        setSelectedCustomer(updatedRecord);
      } else {
        const created = await apiService.create('partner', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedCustomer(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving customer:', err);
      alert(err.message || 'Failed to save customer record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="customers-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/partner/view/all"
          refreshKey={refreshKey}
          title="Customers"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search customer..."
          newButtonLabel="+ New Customer"
        />
      ) : (
        <FormView
          title={selectedCustomer ? selectedCustomer.name || 'Customer Details' : 'New Customer'}
          fields={customerFields}
          initialValues={selectedCustomer || {}}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedCustomer ? () => handleDelete(selectedCustomer) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedCustomer ? 'Update Customer' : 'Save Customer'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New Customer"
        />
      )}
    </div>
  );
};

export default CustomerList;
