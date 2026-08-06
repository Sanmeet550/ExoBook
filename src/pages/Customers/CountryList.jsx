import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const CountryList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currencies,setCurrencies] = useState([]);

  const columns = [
    { key: 'name', label: 'Country Name' },
    { key: 'code', label: 'ISO Code' },
    { key: 'phone_code', label: 'Phone Dial Code' },
    { key: 'currency_id', label: 'Currency'}
  ];

  const countryFields = [
    { name: 'name', label: 'Country Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. India' },
    { name: 'code', label: 'Country Code', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. IN' },
    { name: 'phone_code', label: 'Phone Dial Code', type: 'text', required: true, gridSpan: 12, placeholder: 'e.g. +91' },
    { name: 'currency_id', label: 'Currency', type: 'select', required: true, gridSpan: 12, placeholder: 'e.g. +91',options: currencies, optionLabel: 'name', optionValue: 'id' }
  ];

  useEffect(()=>{
    fetchCurrencies()
  },[])

  const fetchCurrencies = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/currency/view/all`)
      console.log(resp.data)
      setCurrencies(resp.data)
      
    } catch (error) {
      console.log(error)
    }

  }

  const handleNew = () => {
    setEditingCountry(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingCountry(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      await apiService.delete('country', row.id);
      setRefreshKey(k => k + 1);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingCountry) {
      await apiService.update('country', editingCountry.id, formData);
    } else {
      await apiService.create('country', formData);
    }
    setIsModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="countries-page">
      <ListView
        apiUrl="/country/view/all"
        refreshKey={refreshKey}
        title="Countries"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search country..."
        newButtonLabel="+ New Country"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCountry ? "Edit Country" : "Create Country"}
      >
        <FormView
          fields={countryFields}
          initialValues={editingCountry || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingCountry ? "Update Country" : "Save Country"}
        />
      </Modal>
    </div>
  );
};

export default CountryList;
