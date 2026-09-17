import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const CountryList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'Country Name' },
    { key: 'code', label: 'ISO Code' },
    { key: 'phone_code', label: 'Phone Dial Code' },
    {
      key: 'currency_id',
      label: 'Currency',
      render: (val) => {
        if (!val) return '-';
        const curr = currencies.find((c) => String(c.id) === String(val));
        return curr ? curr.name : val;
      }
    }
  ];

  const countryFields = [
    { name: 'name', label: 'Country Name', type: 'text', gridSpan: 6, placeholder: 'e.g. India' },
    { name: 'code', label: 'Country Code', type: 'text', gridSpan: 6, placeholder: 'e.g. IN' },
    { name: 'phone_code', label: 'Phone Dial Code', type: 'text', gridSpan: 6, placeholder: 'e.g. +91' },
    { name: 'currency_id', label: 'Currency', type: 'select', gridSpan: 6, placeholder: 'Select Currency', options: currencies, optionLabel: 'name', optionValue: 'id' }
  ];

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/currency/view/all`);
      setCurrencies(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch currencies:', error);
    }
  };

  const [formServerErrors, setFormServerErrors] = useState([]);

  const handleNew = () => {
    setSelectedCountry(null);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleRowClick = (country) => {
    setSelectedCountry(country);
    setIsEditing(false);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEditRow = (country) => {
    setSelectedCountry(country);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setFormServerErrors([]);
  };

  const handleDelete = async (row) => {
    const target = row || selectedCountry;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete ${target.name}?`)) {
      setFormServerErrors([]);
      try {
        await apiService.delete('country', target.id);
        setViewMode('list');
        setSelectedCountry(null);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error('Error deleting country:', err);
        const errList = err?.errors || err?.response?.data?.errors || [{ field: 'id', message: err?.message || 'Deletion failed.' }];
        setFormServerErrors(errList);
        const firstMsg = errList[0]?.message || err?.message || 'Deletion failed.';
        alert(firstMsg);
      }
    }
  };

  const handleDiscard = () => {
    setFormServerErrors([]);
    if (selectedCountry) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCountry(null);
    setIsEditing(false);
    setFormServerErrors([]);
  };

  const handleSubmit = async (formData, { setServerErrors } = {}) => {
    setSaving(true);
    setFormServerErrors([]);
    try {
      if (selectedCountry) {
        const updated = await apiService.update('country', selectedCountry.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedCountry, ...formData };
        setSelectedCountry(updatedRecord);
      } else {
        const created = await apiService.create('country', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedCountry(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving country:', err);
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
    <div className="countries-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/country/view/all"
          refreshKey={refreshKey}
          title="Countries"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search country..."
          newButtonLabel="+ New Country"
        />
      ) : (
        <FormView
          title={selectedCountry ? selectedCountry.name || 'Country Details' : 'New Country'}
          fields={countryFields}
          initialValues={selectedCountry || {}}
          serverErrors={formServerErrors}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedCountry ? () => handleDelete(selectedCountry) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedCountry ? 'Update Country' : 'Save Country'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New Country"
        />
      )}
    </div>
  );
};

export default CountryList;
