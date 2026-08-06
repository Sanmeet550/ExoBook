import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const StateList = () => {
  console.log('State')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [countries,setCountries] = useState([]);

  const columns = [
    { key: 'name', label: 'State Name' },
    { key: 'code', label: 'State Code' },
    { key: 'country_id', label: 'Country' }
  ];

  const stateFields = [
    { name: 'name', label: 'State Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. Maharashtra' },
    { name: 'code', label: 'State Code', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. MH' },
    { name: 'country_id', label: 'Country', type: 'select', options: countries, required: true, gridSpan: 12,optionLabel: 'name', optionValue: 'id'  }
  ];

  useEffect(()=>{
    fetchCountries()
  },[])

  const fetchCountries = async() => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/country/view/all`)
      console.log(resp.data)
      setCountries(resp.data)
      
    } catch (error) {
      console.log(error)
      
    }
  }

  const handleNew = () => {
    setEditingState(null);
    setIsModalOpen(true);
  };

  const handleEdit = (stateRow) => {
    setEditingState(stateRow);
    setIsModalOpen(true);
  };

  const handleDelete = async (stateRow) => {
    if (window.confirm(`Are you sure you want to delete state ${stateRow.name}?`)) {
      await apiService.delete('states', stateRow.id);
      setRefreshKey(k => k + 1);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingState) {
      await apiService.update('state', editingState.id, formData);
    } else {
      await apiService.create('state', formData);
    }
    setIsModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="states-page">
      <ListView
        apiUrl="/state/view/all"
        refreshKey={refreshKey}
        title="States"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search states..."
        newButtonLabel="+ New State"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingState ? "Edit State" : "Create State"}
      >
        <FormView
          fields={stateFields}
          initialValues={editingState || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingState ? "Update State" : "Save State"}
        />
      </Modal>
    </div>
  );
};

export default StateList;
