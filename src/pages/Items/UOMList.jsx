import React, { useEffect, useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const UOMList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUom, setEditingUom] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [uoms, setUoms] = useState([]);

  const columns = [
    { key: 'name', label: 'UOM Name' },
    { key: 'quantity', label: 'Quantity / Ratio', render: (val) => val ?? 1 },
    // {
    //   key: 'reference_unit_id',
    //   label: 'Reference Unit',
    //   render: (val) => {
    //     if (!val) return '-';
    //     const refUom = uoms.find((u) => u.id === val);
    //     return refUom ? refUom.name : val;
    //   }
    // }
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
      gridSpan: 6,
      placeholder: 'e.g. 1'
    },
    // {
    //   name: 'reference_unit_id',
    //   label: 'Reference Unit',
    //   type: 'select',
    //   options: [],
    //   optionLabel: 'name',
    //   optionValue: 'id',
    //   gridSpan: 6
    // }
  ];

  useEffect(() => {
    fetchUoms();
  }, [refreshKey]);

  const fetchUoms = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/uom/view/all`);
      setUoms(resp.data || []);
    } catch (error) {
      console.error('Failed to fetch UOMs:', error);
    }
  };

  const handleNew = () => {
    setEditingUom(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingUom(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete item ${row.name}?`)) {
      await apiService.delete('uom', row.id);
      setRefreshKey(k => k + 1);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingUom) {
      await apiService.update('uom', editingUom.id, formData);
    } else {
      await apiService.create('uom', formData);
    }
    setIsModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="uom-page">
      <ListView
        apiUrl="/uom/view/all"
        refreshKey={refreshKey}
        title="Unit of Measurement (UOM)"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search UOM..."
        newButtonLabel="+ New UOM"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUom ? 'Edit UOM' : 'Create Unit of Measurement'}
      >
        <FormView
          fields={uomFields}
          initialValues={editingUom || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingUom ? 'Update UOM' : 'Save UOM'}
        />
      </Modal>
    </div>
  );
};

export default UOMList;
