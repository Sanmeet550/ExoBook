import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const WarehouseList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [companies, setCompanies] = useState([]);

  const columns = [
    { key: 'name', label: 'Warehouse Name' },
    { key: 'code', label: 'Code'},
    { key: 'company_id', label: 'Company'}
  ];

  const warehouseFields = [
    { name: 'name', label: 'Warehouse Name', type: 'text', gridSpan: 12, placeholder: 'e.g. Main Warehouse' },
    { name: 'code', label: 'Code', type: 'text', placeholder: 'e.g. Code'},
    { name: 'company_id', label: 'Company', type: 'select', placeholder: 'e.g. Company',options: companies, optionLabel: 'name', optionValue: 'id'},

  ];

  const [formServerErrors, setFormServerErrors] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/company/view/all`);
      console.log(resp)
      setCompanies(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const handleNew = () => {
    setSelectedWarehouse(null);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleRowClick = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsEditing(false);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEditRow = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setFormServerErrors([]);
  };

  const handleDelete = async (warehouse) => {
    const target = warehouse || selectedWarehouse;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete ${target.name}?`)) {
      setFormServerErrors([]);
      try {
        await apiService.request('delete', `/warehouse/delete/${target.id}`);
        setViewMode('list');
        setSelectedWarehouse(null);
        setRefreshKey((k) => k + 1);
      } catch (error) {
        console.error('Failed to delete warehouse:', error);
        const errList = error?.errors || error?.response?.data?.errors || [{ field: 'id', message: error?.message || 'Failed to delete warehouse' }];
        setFormServerErrors(errList);
        const firstMsg = errList[0]?.message || error?.message || 'Failed to delete warehouse';
        alert(firstMsg);
      }
    }
  };

  const handleDiscard = () => {
    setFormServerErrors([]);
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
    setFormServerErrors([]);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    setFormServerErrors([]);
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
      const errList = error?.errors || error?.response?.data?.errors;
      if (errList) setFormServerErrors(errList);
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
          serverErrors={formServerErrors}
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
