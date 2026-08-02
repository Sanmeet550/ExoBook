import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import { initialStates } from '../../services/mockData';

export const StateList = () => {
  const [states, setStates] = useState(initialStates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState(null);

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

  const handleDelete = (stateRow) => {
    if (window.confirm(`Are you sure you want to delete state ${stateRow.name}?`)) {
      setStates(prev => prev.filter(s => s.id !== stateRow.id));
    }
  };

  const handleSubmit = (formData) => {
    if (editingState) {
      setStates(prev => prev.map(s => s.id === editingState.id ? { ...s, ...formData } : s));
    } else {
      setStates(prev => [{ id: Date.now(), ...formData }, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="states-page">
      <ListView
        title="States"
        columns={columns}
        data={states}
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
