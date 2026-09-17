import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';

export const CurrencyList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formServerErrors, setFormServerErrors] = useState([]);

  const columns = [
    { key: 'name', label: 'Currency Code' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'currency_unit_label', label: 'Unit Label' },
    { key: 'currency_subunit_label', label: 'Subunit Label' }
  ];

  const currencyFields = [
    { name: 'name', label: 'Currency Code', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. USD, INR, EUR' },
    { name: 'full_name', label: 'Full Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. US Dollar, Indian Rupee' },
    { name: 'symbol', label: 'Symbol', type: 'text', required: true, gridSpan: 4, placeholder: 'e.g. $, ₹, €' },
    { name: 'currency_unit_label', label: 'Unit Label', type: 'text', required: true, gridSpan: 4, placeholder: 'e.g. Dollar, Rupee' },
    { name: 'currency_subunit_label', label: 'Subunit Label', type: 'text', required: true, gridSpan: 4, placeholder: 'e.g. Cent, Paisa' }
  ];

  const handleNew = () => {
    setSelectedCurrency(null);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleRowClick = (currency) => {
    setSelectedCurrency(currency);
    setIsEditing(false);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEditRow = (currency) => {
    setSelectedCurrency(currency);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setFormServerErrors([]);
  };

  const handleDelete = async (row) => {
    const target = row || selectedCurrency;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete ${target.name}?`)) {
      setFormServerErrors([]);
      try {
        await apiService.delete('currency', target.id);
        setViewMode('list');
        setSelectedCurrency(null);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error('Error deleting currency:', err);
        const errList = err?.errors || err?.response?.data?.errors || [{ field: 'id', message: err?.message || 'Deletion failed.' }];
        setFormServerErrors(errList);
        const firstMsg = errList[0]?.message || err?.message || 'Deletion failed.';
        alert(firstMsg);
      }
    }
  };

  const handleDiscard = () => {
    setFormServerErrors([]);
    if (selectedCurrency) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCurrency(null);
    setIsEditing(false);
    setFormServerErrors([]);
  };

  const handleSubmit = async (formData, { setServerErrors } = {}) => {
    setSaving(true);
    setFormServerErrors([]);
    try {
      if (selectedCurrency) {
        const updated = await apiService.update('currency', selectedCurrency.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedCurrency, ...formData };
        setSelectedCurrency(updatedRecord);
      } else {
        const created = await apiService.create('currency', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedCurrency(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving currency:', err);
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
    <div className="currencies-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/currency/view/all"
          refreshKey={refreshKey}
          title="Currencies"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search currency by code or name..."
          newButtonLabel="+ New Currency"
        />
      ) : (
        <FormView
          title={selectedCurrency ? selectedCurrency.name || 'Currency Details' : 'New Currency'}
          fields={currencyFields}
          initialValues={selectedCurrency || {}}
          serverErrors={formServerErrors}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedCurrency ? () => handleDelete(selectedCurrency) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedCurrency ? 'Update Currency' : 'Save Currency'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New Currency"
        />
      )}
    </div>
  );
};

export default CurrencyList;
