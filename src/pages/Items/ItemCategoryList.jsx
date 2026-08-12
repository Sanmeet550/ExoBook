import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';

export const ItemCategoryList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);

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
    setSelectedCategory(null);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleRowClick = (row) => {
    setSelectedCategory(row);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleEditRow = (row) => {
    setSelectedCategory(row);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async (row) => {
    const target = row || selectedCategory;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete category ${target.name}?`)) {
      await apiService.delete('categories', target.id);
      setViewMode('list');
      setSelectedCategory(null);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleDiscard = () => {
    if (selectedCategory) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCategory(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (selectedCategory) {
        const updated = await apiService.update('product-category', selectedCategory.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedCategory, ...formData };
        setSelectedCategory(updatedRecord);
      } else {
        const created = await apiService.create('product-category', { itemCount: 0, ...formData });
        const newRecord = (created && created.id) ? created : { itemCount: 0, ...formData };
        setSelectedCategory(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving category:', err);
      alert(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="categories-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/product-category/view/all"
          refreshKey={refreshKey}
          title="Item Categories"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search category..."
          newButtonLabel="+ New Category"
        />
      ) : (
        <FormView
          title={selectedCategory ? selectedCategory.name || 'Category Details' : 'New Item Category'}
          fields={categoryFields}
          initialValues={selectedCategory || {}}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedCategory ? () => handleDelete(selectedCategory) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedCategory ? 'Update Category' : 'Save Category'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New Category"
        />
      )}
    </div>
  );
};

export default ItemCategoryList;
