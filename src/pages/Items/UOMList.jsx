import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';

export const UOMList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedUom, setSelectedUom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'UOM Name' },
    { key: 'quantity', label: 'Quantity / Ratio', render: (val) => val ?? 1 }
  ];

  const uomFields = [
    {
      name: 'name',
      label: 'UOM Name',
      type: 'text',
      required: true,
      gridSpan: 12,
      placeholder: 'e.g. Dozen, Kg, Box, Pcs'
    },
    {
      name: 'quantity',
      label: 'Quantity / Ratio',
      type: 'number',
      gridSpan: 12,
      placeholder: 'e.g. 1'
    }
  ];

  const handleNew = () => {
    setSelectedUom(null);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleRowClick = (row) => {
    setSelectedUom(row);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleEditRow = (row) => {
    setSelectedUom(row);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async (row) => {
    const target = row || selectedUom;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete UOM ${target.name}?`)) {
      await apiService.delete('uom', target.id);
      setViewMode('list');
      setSelectedUom(null);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleDiscard = () => {
    if (selectedUom) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedUom(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (selectedUom) {
        const updated = await apiService.update('uom', selectedUom.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedUom, ...formData };
        setSelectedUom(updatedRecord);
      } else {
        const created = await apiService.create('uom', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedUom(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving UOM:', err);
      alert(err.message || 'Failed to save UOM.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="uom-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/uom/view/all"
          refreshKey={refreshKey}
          title="Unit of Measurement (UOM)"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search UOM..."
          newButtonLabel="+ New UOM"
        />
      ) : (
        <FormView
          title={selectedUom ? selectedUom.name || 'UOM Details' : 'New Unit of Measurement'}
          fields={uomFields}
          initialValues={selectedUom || {}}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedUom ? () => handleDelete(selectedUom) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedUom ? 'Update UOM' : 'Save UOM'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New UOM"
        />
      )}
    </div>
  );
};

export default UOMList;
