import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const ItemList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [categories, setCategories] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'Item Name' },
    { key: 'code', label: 'SKU / Code' },
    {
      key: 'category',
      label: 'Category',
      render: (val, row) => {
        if (row.categ_id) {
          const cat = categories.find((c) => String(c.id) === String(row.categ_id));
          if (cat) return cat.name;
        }
        return val || '-';
      }
    },
    { key: 'product_type', label: 'Product Type' },
    { key: 'price', label: 'Price ($)', render: (val) => val != null ? `$${val}` : '-' },
    { key: 'stock', label: 'Stock Quantity' },
    {
      key: 'unit',
      label: 'Unit',
      render: (val, row) => {
        if (row.uom_id) {
          const u = uoms.find((item) => String(item.id) === String(row.uom_id));
          if (u) return u.name;
        }
        return val || '-';
      }
    }
  ];

  const itemFields = [
    { name: 'name', label: 'Item Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. Thermal Printer' },
    { name: 'code', label: 'Item SKU / Code', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. HW-001' },
    {
      name: 'product_type',
      label: 'Product Type',
      type: 'select',
      required: true,
      gridSpan: 6,
      placeholder: 'Select Product Type',
      options: [
        { value: 'STOCKABLE', label: 'Stockable' },
        { value: 'CONSUMABLE', label: 'Consumable' },
        { value: 'SERVICE', label: 'Service' }
      ],
      optionLabel: 'label',
      optionValue: 'value'
    },
    { name: 'categ_id', label: 'Category', type: 'select', required: true, gridSpan: 6, placeholder: 'Select Category', options: categories, optionLabel: 'name', optionValue: 'id' },
    { name: 'price', label: 'Selling Price ($)', type: 'number', required: true, gridSpan: 6, placeholder: 'e.g. 150' },
    { name: 'stock', label: 'Opening Stock', type: 'number', required: true, gridSpan: 6, placeholder: 'e.g. 50' },
    { name: 'uom_id', label: 'Unit of Measure', type: 'select', options: uoms.length > 0 ? uoms : ['Pcs', 'License', 'Box', 'Kg', 'Meter', 'Year'], optionLabel: 'name', optionValue: 'id', gridSpan: 6 }
  ];

  useEffect(() => {
    fetchCategories();
    fetchUoms();
  }, []);

  const fetchCategories = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/product-category/view/all`);
      setCategories(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchUoms = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/uom/view/all`);
      setUoms(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch UOMs:', error);
    }
  };

  const handleNew = () => {
    setSelectedItem(null);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleEditRow = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async (row) => {
    const target = row || selectedItem;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete item ${target.name}?`)) {
      await apiService.delete('items', target.id);
      setViewMode('list');
      setSelectedItem(null);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleDiscard = () => {
    if (selectedItem) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedItem(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (selectedItem) {
        const updated = await apiService.update('product', selectedItem.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedItem, ...formData };
        console.log(updatedRecord)
        setSelectedItem(updatedRecord);
      } else {
        const created = await apiService.create('product', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedItem(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving item:', err);
      alert(err.message || 'Failed to save item.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="items-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/product/view/all"
          refreshKey={refreshKey}
          title="Items & Products"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search items by name, SKU or code"
          newButtonLabel="+ New Item"
        />
      ) : (
        <FormView
          title={selectedItem ? selectedItem.name || 'Item Details' : 'New Item'}
          fields={itemFields}
          initialValues={selectedItem || {}}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedItem ? () => handleDelete(selectedItem) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedItem ? 'Update Item' : 'Save Item'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New Item"
        />
      )}
    </div>
  );
};

export default ItemList;
