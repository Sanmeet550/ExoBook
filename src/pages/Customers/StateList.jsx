import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';

export const StateList = () => {
  console.log('State')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'name', label: 'State Name' },
    { key: 'code', label: 'State Code' },
    { key: 'country', label: 'Country' }
  ];

  const stateFields = [
    { name: 'name', label: 'State Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. Maharashtra' },
    { name: 'code', label: 'State Code', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. MH' },
    { name: 'country', label: 'Country', type: 'select', options: ['India', 'United States', 'United Kingdom'], required: true, gridSpan: 12 }
  ];

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
      await apiService.update('/state/update', editingState.id, formData);
    } else {
      await apiService.create('/state', formData);
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
