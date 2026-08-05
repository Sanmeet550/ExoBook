import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';

export const ItemList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'name', label: 'Item Name' },
    { key: 'code', label: 'SKU / Code' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price ($)', render: (val) => `$${val}` },
    { key: 'stock', label: 'Stock Quantity' },
    { key: 'unit', label: 'Unit' }
  ];

  const itemFields = [
    { name: 'name', label: 'Item Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. Thermal Printer' },
    { name: 'code', label: 'Item SKU / Code', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. HW-001' },
    { name: 'category', label: 'Category', type: 'select', options: ['Software', 'Hardware', 'Supplies'], required: true, gridSpan: 6 },
    { name: 'price', label: 'Selling Price ($)', type: 'number', required: true, gridSpan: 6, placeholder: 'e.g. 150' },
    { name: 'stock', label: 'Opening Stock', type: 'number', required: true, gridSpan: 6, placeholder: 'e.g. 50' },
    { name: 'unit', label: 'Unit of Measure', type: 'select', options: ['Pcs', 'License', 'Box', 'Kg', 'Meter', 'Year'], gridSpan: 6 }
  ];

  const handleNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete item ${row.name}?`)) {
      await apiService.delete('items', row.id);
      setRefreshKey(k => k + 1);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingItem) {
      await apiService.update('items', editingItem.id, formData);
    } else {
      await apiService.create('items', formData);
    }
    setIsModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="items-page">
      <ListView
        apiUrl="items"
        refreshKey={refreshKey}
        title="Items & Products"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search items by name, SKU or code"
        newButtonLabel="+ New Item"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Item" : "Create New Item"}
      >
        <FormView
          fields={itemFields}
          initialValues={editingItem || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingItem ? "Update Item" : "Save Item"}
        />
      </Modal>
    </div>
  );
};

export default ItemList;
