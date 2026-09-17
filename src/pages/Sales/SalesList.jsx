import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';

export const SalesList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedSale, setSelectedSale] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'invoiceNo', label: 'Invoice No' },
    { key: 'customerName', label: 'Customer' },
    { key: 'date', label: 'Invoice Date' },
    { key: 'amount', label: 'Total Amount' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`status-badge ${val === 'Paid' ? 'paid' : 'pending'}`}>
          {val}
        </span>
      )
    }
  ];

  const salesFields = [
    { name: 'invoiceNo', label: 'Invoice Number', type: 'text', required: true, gridSpan: 6, placeholder: 'INV-2026-xxx' },
    { name: 'customerName', label: 'Customer Name', type: 'select', options: ['ABC Store', 'XYZ Store', 'John Traders', 'Apex Solutions'], required: true, gridSpan: 6 },
    { name: 'date', label: 'Date', type: 'date', required: true, gridSpan: 6 },
    { name: 'amount', label: 'Total Amount ($)', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. $1,500.00' },
    { name: 'status', label: 'Payment Status', type: 'select', options: ['Paid', 'Pending', 'Overdue'], required: true, gridSpan: 12 }
  ];

  const [formServerErrors, setFormServerErrors] = useState([]);

  const handleNew = () => {
    setSelectedSale(null);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleRowClick = (row) => {
    setSelectedSale(row);
    setIsEditing(false);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEditRow = (row) => {
    setSelectedSale(row);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setFormServerErrors([]);
  };

  const handleDelete = async (row) => {
    const target = row || selectedSale;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete invoice ${target.invoiceNo}?`)) {
      setFormServerErrors([]);
      try {
        await apiService.delete('sales', target.id);
        setViewMode('list');
        setSelectedSale(null);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error('Error deleting sales invoice:', err);
        const errList = err?.errors || err?.response?.data?.errors || [{ field: 'id', message: err?.message || 'Deletion failed.' }];
        setFormServerErrors(errList);
        const firstMsg = errList[0]?.message || err?.message || 'Deletion failed.';
        alert(firstMsg);
      }
    }
  };

  const handleDiscard = () => {
    setFormServerErrors([]);
    if (selectedSale) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedSale(null);
    setIsEditing(false);
    setFormServerErrors([]);
  };

  const handleSubmit = async (formData, { setServerErrors } = {}) => {
    setSaving(true);
    setFormServerErrors([]);
    try {
      if (selectedSale) {
        const updated = await apiService.update('sales', selectedSale.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedSale, ...formData };
        setSelectedSale(updatedRecord);
      } else {
        const created = await apiService.create('sales', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedSale(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving sales invoice:', err);
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
    <div className="sales-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="sales"
          refreshKey={refreshKey}
          title="Sales Invoices"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search invoices by number or customer..."
          newButtonLabel="+ Create Invoice"
        />
      ) : (
        <FormView
          title={selectedSale ? selectedSale.invoiceNo || 'Sales Invoice Details' : 'Create Sales Invoice'}
          fields={salesFields}
          initialValues={selectedSale || { date: new Date().toISOString().split('T')[0] }}
          serverErrors={formServerErrors}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedSale ? () => handleDelete(selectedSale) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedSale ? 'Update Invoice' : 'Save Invoice'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ Create Invoice"
        />
      )}
    </div>
  );
};

export default SalesList;
