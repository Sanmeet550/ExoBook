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

  const [formServerErrors, setFormServerErrors] = useState([]);

  const handleNew = () => {
    setSelectedUom(null);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleRowClick = (row) => {
    setSelectedUom(row);
    setIsEditing(false);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEditRow = (row) => {
    setSelectedUom(row);
    setIsEditing(true);
    setFormServerErrors([]);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setFormServerErrors([]);
  };

  const handleDelete = async (row) => {
    const target = row || selectedUom;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete UOM ${target.name}?`)) {
      setFormServerErrors([]);
      try {
        await apiService.delete('uom', target.id);
        setViewMode('list');
        setSelectedUom(null);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error('Error deleting UOM:', err);
        const errList = err?.errors || err?.response?.data?.errors || [{ field: 'id', message: err?.message || 'Deletion failed.' }];
        setFormServerErrors(errList);
        const firstMsg = errList[0]?.message || err?.message || 'Deletion failed.';
        alert(firstMsg);
      }
    }
  };

  const handleDiscard = () => {
    setFormServerErrors([]);
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
    setFormServerErrors([]);
  };

  const handleSubmit = async (formData, { setServerErrors } = {}) => {
    setSaving(true);
    setFormServerErrors([]);
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
          serverErrors={formServerErrors}
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
