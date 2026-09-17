import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const StateList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedState, setSelectedState] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [countries, setCountries] = useState([]);
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'State Name' },
    { key: 'code', label: 'State Code' },
    {
      key: 'country_id',
      label: 'Country',
      render: (val) => {
        if (!val) return '-';
        const c = countries.find((item) => String(item.id) === String(val));
        return c ? c.name : val;
      }
    }
  ];

  const stateFields = [
    { name: 'name', label: 'State Name', type: 'text', gridSpan: 6, placeholder: 'e.g. Maharashtra' },
    { name: 'code', label: 'State Code', type: 'text', gridSpan: 6, placeholder: 'e.g. MH' },
    { name: 'country_id', label: 'Country', type: 'select', options: countries, gridSpan: 12, optionLabel: 'name', optionValue: 'id' }
  ];

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/country/view/all`);
      setCountries(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const [formServerErrors, setFormServerErrors] = useState([]);

  const handleNew = () => {
    setSelectedState(null);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleRowClick = (stateRow) => {
    setSelectedState(stateRow);
    setIsEditing(false);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEditRow = (stateRow) => {
    setSelectedState(stateRow);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setFormServerErrors([]);
  };

  const handleDelete = async (stateRow) => {
    const target = stateRow || selectedState;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete state ${target.name}?`)) {
      setFormServerErrors([]);
      try {
        await apiService.delete('state', target.id);
        setViewMode('list');
        setSelectedState(null);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error('Error deleting state:', err);
        const errList = err?.errors || err?.response?.data?.errors || [{ field: 'id', message: err?.message || 'Deletion failed.' }];
        setFormServerErrors(errList);
        const firstMsg = errList[0]?.message || err?.message || 'Deletion failed.';
        alert(firstMsg);
      }
    }
  };

  const handleDiscard = () => {
    setFormServerErrors([]);
    if (selectedState) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedState(null);
    setIsEditing(false);
    setFormServerErrors([]);
  };

  const handleSubmit = async (formData, { setServerErrors } = {}) => {
    setSaving(true);
    setFormServerErrors([]);
    try {
      if (selectedState) {
        const updated = await apiService.update('state', selectedState.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedState, ...formData };
        setSelectedState(updatedRecord);
      } else {
        const created = await apiService.create('state', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedState(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving state:', err);
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
    <div className="states-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/state/view/all"
          refreshKey={refreshKey}
          title="States"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search states..."
          newButtonLabel="+ New State"
        />
      ) : (
        <FormView
          title={selectedState ? selectedState.name || 'State Details' : 'New State'}
          fields={stateFields}
          initialValues={selectedState || {}}
          serverErrors={formServerErrors}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedState ? () => handleDelete(selectedState) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedState ? 'Update State' : 'Save State'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New State"
        />
      )}
    </div>
  );
};

export default StateList;
