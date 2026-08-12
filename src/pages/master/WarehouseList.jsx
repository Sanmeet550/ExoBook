import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';

export const WarehouseList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'Warehouse Name' }
  ];

  const warehouseFields = [
    { name: 'name', label: 'Warehouse Name', type: 'text', required: true, gridSpan: 12, placeholder: 'e.g. Main Warehouse' }
  ];

  const handleNew = () => {
    setSelectedWarehouse(null);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleRowClick = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleEditRow = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async (warehouse) => {
    const target = warehouse || selectedWarehouse;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete ${target.name}?`)) {
      try {
        await apiService.request('delete', `/warehouse/delete/${target.id}`);
        setViewMode('list');
        setSelectedWarehouse(null);
        setRefreshKey((k) => k + 1);
      } catch (error) {
        console.error('Failed to delete warehouse:', error);
        alert(error.message || 'Failed to delete warehouse');
      }
    }
  };

  const handleDiscard = () => {
    if (selectedWarehouse) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedWarehouse(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (selectedWarehouse) {
        const res = await apiService.request('patch', `/warehouse/update/${selectedWarehouse.id}`, formData);
        const updatedRecord = (res && res.id) ? res : { ...selectedWarehouse, ...formData };
        setSelectedWarehouse(updatedRecord);
      } else {
        const res = await apiService.request('post', '/warehouse/create', formData);
        const newRecord = (res && res.id) ? res : { ...formData };
        setSelectedWarehouse(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error('Failed to save warehouse:', error);
      alert(error.message || 'Failed to save warehouse');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="warehouses-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/warehouse/view/all"
          refreshKey={refreshKey}
          title="Warehouses"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search warehouse..."
          newButtonLabel="+ New Warehouse"
        />
      ) : (
        <FormView
          title={selectedWarehouse ? selectedWarehouse.name || 'Warehouse Details' : 'New Warehouse'}
          fields={warehouseFields}
          initialValues={selectedWarehouse || {}}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedWarehouse ? () => handleDelete(selectedWarehouse) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedWarehouse ? 'Update Warehouse' : 'Save Warehouse'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New Warehouse"
        />
      )}
    </div>
  );
};

export default WarehouseList;
