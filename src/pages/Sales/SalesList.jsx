import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const SalesList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedSale, setSelectedSale] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [partners, setPartner] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [companies, setCompanies] = useState([]);

  const columns = [
    { key: 'name', label: 'Invoice No' },
    { key: 'partner_id', label: 'Customer' },
    { key: 'date', label: 'Invoice Date' },
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
    { name: 'name', label: 'Number', type: 'text', gridSpan: 6, placeholder: 'INV-2026-xxx' },
    { name: 'partner_id', label: 'Customer', type: 'select', options: partners, gridSpan: 6, optionLabel: 'name', optionValue: 'id'  },
    { name: 'validity_date', label: 'Date', type: 'date', required: true, gridSpan: 6 },
    // { name: 'state_id', label: 'State', type: 'select', options: states, gridSpan: 6, optionLabel: 'name', optionValue: 'id' },
    { name: 'warehouse_id', label: 'Warehouse', type: 'select', options: warehouses, gridSpan: 6, optionLabel: 'name', optionValue: 'id' },
    { name: 'country_id', label: 'Country', type: 'select', options: countries, gridSpan: 12, optionLabel: 'name', optionValue: 'id' },
    { name: 'company_id', label: 'Company', type: 'select', placeholder: 'e.g. Company',options: companies, optionLabel: 'name', optionValue: 'id'},
    { name: 'currency_id', label: 'Currency', type: 'select', gridSpan: 6, placeholder: 'Select Currency', options: currencies, optionLabel: 'name', optionValue: 'id' }
  ];

  
  useEffect(()=>{
    fetchWarehouses();
    fetchCustomers();
    fetchStates();
    fetchCountries();
    fetchCurrencies();
    fetchCompanies();
  },[])

  const fetchCompanies = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/company/view/all`);
      console.log(resp)
      setCompanies(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/warehouse/view/all`);
      setWarehouses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };


  const fetchStates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/state/view/all`);
      setStates(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/country/view/all`);
      setCountries(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/currency/view/all`);
      setCurrencies(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch currencies:', error);
    }
  };



  const fetchCustomers = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/partner/view/all`);
      console.log(resp)
      setPartner(Array.isArray(resp.data) ? resp.data : []);
      
    } catch (error) {
      console.error('Failed to fetch partner:', error);
    }
  };

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
          apiUrl="sales/view/all"
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
