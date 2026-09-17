import React, { useState, useEffect } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const CompanyList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const columns = [
    { key: 'name', label: 'Company Name' },
    { key: 'email', label: 'Email' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'city', label: 'City' }
  ];

  const companyFields = [
    { name: 'name', label: 'Company Name', type: 'text', gridSpan: 6, placeholder: 'e.g. Acme Corp' },
    { name: 'email', label: 'Email Address', type: 'email', gridSpan: 6, placeholder: 'e.g. info@acme.com' },
    { name: 'street', label: 'Street', type: 'text', gridSpan: 6, placeholder: 'e.g. Street' },
    { name: 'street2', label: 'Street2', type: 'text', gridSpan: 6, placeholder: 'e.g. Street2' },
    { name: 'mobile', label: 'Mobile Number', type: 'text', gridSpan: 6, placeholder: 'e.g. +123456789' },
    { name: 'city', label: 'City', type: 'text', gridSpan: 6, placeholder: 'e.g. New York' },
    { name: 'state_id', label: 'State', type: 'select', options: states, gridSpan: 6, optionLabel: 'name', optionValue: 'id' },
    { name: 'country_id', label: 'Country', type: 'select', options: countries, gridSpan: 12, optionLabel: 'name', optionValue: 'id' },
    { name: 'currency_id', label: 'Currency', type: 'select', gridSpan: 6, placeholder: 'Select Currency', options: currencies, optionLabel: 'name', optionValue: 'id' }
  ];

  useEffect(() => {
    fetchStates();
    fetchCountries();
    fetchCurrencies();
  }, []);

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

  const [formServerErrors, setFormServerErrors] = useState([]);

  const handleNew = () => {
    setSelectedCompany(null);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleRowClick = (company) => {
    setSelectedCompany(company);
    setIsEditing(false);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEditRow = (company) => {
    setSelectedCompany(company);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setFormServerErrors([]);
  };

  const handleDelete = async (company) => {
    const target = company || selectedCompany;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete ${target.name}?`)) {
      setFormServerErrors([]);
      try {
        await apiService.request('delete', `/company/delete/${target.id}`);
        setViewMode('list');
        setSelectedCompany(null);
        setRefreshKey((k) => k + 1);
      } catch (error) {
        console.error('Failed to delete company:', error);
        const errList = error?.errors || error?.response?.data?.errors || [{ field: 'id', message: error?.message || 'Failed to delete company' }];
        setFormServerErrors(errList);
        const firstMsg = errList[0]?.message || error?.message || 'Failed to delete company';
        alert(firstMsg);
      }
    }
  };

  const handleDiscard = () => {
    setFormServerErrors([]);
    if (selectedCompany) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCompany(null);
    setIsEditing(false);
    setFormServerErrors([]);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    setFormServerErrors([]);
    try {
      if (selectedCompany) {
        const res = await apiService.request('patch', `/company/update/${selectedCompany.id}`, formData);
        const updatedRecord = (res && res.id) ? res : { ...selectedCompany, ...formData };
        setSelectedCompany(updatedRecord);
      } else {
        const res = await apiService.request('post', '/company/create', formData);
        const newRecord = (res && res.id) ? res : { ...formData };
        setSelectedCompany(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error('Failed to save company:', error);
      const errList = error?.errors || error?.response?.data?.errors;
      if (errList) setFormServerErrors(errList);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="companies-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/company/view/all"
          refreshKey={refreshKey}
          title="Companies"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search company..."
          newButtonLabel="+ New Company"
        />
      ) : (
        <FormView
          title={selectedCompany ? selectedCompany.name || 'Company Details' : 'New Company'}
          fields={companyFields}
          initialValues={selectedCompany || {}}
          serverErrors={formServerErrors}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedCompany ? () => handleDelete(selectedCompany) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedCompany ? 'Update Company' : 'Save Company'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New Company"
        />
      )}
    </div>
  );
};

export default CompanyList;
