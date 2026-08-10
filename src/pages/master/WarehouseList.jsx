import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';

export const WarehouseList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'name', label: 'Warehouse Name' }
  ];

  const warehouseFields = [
    { name: 'name', label: 'Warehouse Name', type: 'text', required: true, gridSpan: 12, placeholder: 'e.g. Main Warehouse' }
  ];

  const handleNew = () => {
    setEditingWarehouse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setIsModalOpen(true);
  };

  const handleDelete = async (warehouse) => {
    if (window.confirm(`Are you sure you want to delete ${warehouse.name}?`)) {
      try {
        await apiService.request('delete', `/warehouse/delete/${warehouse.id}`);
        setRefreshKey(k => k + 1);
      } catch (error) {
        console.error('Failed to delete warehouse:', error);
        alert(error.message || 'Failed to delete warehouse');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingWarehouse) {
        await apiService.request('patch', `/warehouse/update/${editingWarehouse.id}`, formData);
      } else {
        await apiService.request('post', '/warehouse/create', formData);
      }
      setIsModalOpen(false);
      setRefreshKey(k => k + 1);
    } catch (error) {
      console.error('Failed to save warehouse:', error);
      alert(error.message || 'Failed to save warehouse');
    }
  };

  return (
    <div className="warehouses-page">
      <ListView
        apiUrl="/warehouse/view/all"
        refreshKey={refreshKey}
        title="Warehouses"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search warehouse..."
        newButtonLabel="+ New Warehouse"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWarehouse ? "Edit Warehouse" : "Create Warehouse"}
      >
        <FormView
          fields={warehouseFields}
          initialValues={editingWarehouse || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingWarehouse ? "Update Warehouse" : "Save Warehouse"}
        />
      </Modal>
    </div>
  );
};

export default WarehouseList;
