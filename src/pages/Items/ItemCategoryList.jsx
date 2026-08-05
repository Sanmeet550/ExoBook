import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';

export const ItemCategoryList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'name', label: 'Category Name' },
    { key: 'description', label: 'Description' },
    { key: 'itemCount', label: 'Total Items' }
  ];

  const categoryFields = [
    { name: 'name', label: 'Category Name', type: 'text', required: true, gridSpan: 12, placeholder: 'e.g. Hardware' },
    { name: 'description', label: 'Description', type: 'textarea', gridSpan: 12, placeholder: 'Short category description...' }
  ];

  const handleNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingCategory(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete category ${row.name}?`)) {
      await apiService.delete('categories', row.id);
      setRefreshKey(k => k + 1);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingCategory) {
      await apiService.update('categories', editingCategory.id, formData);
    } else {
      await apiService.create('categories', { itemCount: 0, ...formData });
    }
    setIsModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="categories-page">
      <ListView
        apiUrl="categories"
        refreshKey={refreshKey}
        title="Item Categories"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search category..."
        newButtonLabel="+ New Category"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Create Item Category"}
      >
        <FormView
          fields={categoryFields}
          initialValues={editingCategory || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingCategory ? "Update Category" : "Save Category"}
        />
      </Modal>
    </div>
  );
};

export default ItemCategoryList;
