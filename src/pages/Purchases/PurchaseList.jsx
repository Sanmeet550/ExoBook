import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';

export const PurchaseList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'purchaseNo', label: 'Purchase Order No' },
    { key: 'supplierName', label: 'Supplier Name' },
    { key: 'date', label: 'Order Date' },
    { key: 'amount', label: 'Amount' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`status-badge ${val === 'Completed' ? 'completed' : 'pending'}`}>
          {val}
        </span>
      )
    }
  ];

  const purchaseFields = [
    { name: 'purchaseNo', label: 'PO Number', type: 'text', required: true, gridSpan: 6, placeholder: 'PO-2026-xxx' },
    { name: 'supplierName', label: 'Supplier Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. TechSupply Co' },
    { name: 'date', label: 'Order Date', type: 'date', required: true, gridSpan: 6 },
    { name: 'amount', label: 'Total Amount ($)', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. $1,200.00' },
    { name: 'status', label: 'Order Status', type: 'select', options: ['Completed', 'Pending', 'Cancelled'], required: true, gridSpan: 12 }
  ];

  const handleNew = () => {
    setSelectedPurchase(null);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleRowClick = (row) => {
    setSelectedPurchase(row);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleEditRow = (row) => {
    setSelectedPurchase(row);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async (row) => {
    const target = row || selectedPurchase;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete purchase ${target.purchaseNo}?`)) {
      await apiService.delete('purchases', target.id);
      setViewMode('list');
      setSelectedPurchase(null);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleDiscard = () => {
    if (selectedPurchase) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPurchase(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (selectedPurchase) {
        const updated = await apiService.update('purchases', selectedPurchase.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedPurchase, ...formData };
        setSelectedPurchase(updatedRecord);
      } else {
        const created = await apiService.create('purchases', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedPurchase(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving purchase order:', err);
      alert(err.message || 'Failed to save purchase order.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="purchases-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="purchases"
          refreshKey={refreshKey}
          title="Purchase Orders"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search purchase orders..."
          newButtonLabel="+ New Purchase Order"
        />
      ) : (
        <FormView
          title={selectedPurchase ? selectedPurchase.purchaseNo || 'Purchase Order Details' : 'New Purchase Order'}
          fields={purchaseFields}
          initialValues={selectedPurchase || { date: new Date().toISOString().split('T')[0] }}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedPurchase ? () => handleDelete(selectedPurchase) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedPurchase ? 'Update PO' : 'Save PO'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New PO"
        />
      )}
    </div>
  );
};

export default PurchaseList;
