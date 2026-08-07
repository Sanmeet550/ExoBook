import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const ItemList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [categories,setCategories] = useState([]);

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
    { name: 'categ_id', label: 'Category', type: 'select', required: true, gridSpan: 12, placeholder: 'e.g. +91',options: categories, optionLabel: 'name', optionValue: 'id' },
    { name: 'price', label: 'Selling Price ($)', type: 'number', required: true, gridSpan: 6, placeholder: 'e.g. 150' },
    { name: 'stock', label: 'Opening Stock', type: 'number', required: true, gridSpan: 6, placeholder: 'e.g. 50' },
    { name: 'unit', label: 'Unit of Measure', type: 'select', options: ['Pcs', 'License', 'Box', 'Kg', 'Meter', 'Year'], gridSpan: 6 }
  ];

  useEffect(()=>{
    fetchCategories()
  },[])

  const fetchCategories = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/product-category/view/all`)
      console.log(resp.data)
      setCategories(resp.data)
      
    } catch (error) {
      console.log(error)
    }

  }

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
      await apiService.update('product', editingItem.id, formData);
    } else {
      await apiService.create('product', formData);
    }
    setIsModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="items-page">
      <ListView
        apiUrl="/product/view/all"
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
