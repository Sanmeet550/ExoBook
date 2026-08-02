import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import { initialPurchases } from '../../services/mockData';

export const PurchaseList = () => {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const columns = [
    { key: 'purchaseNo', label: 'Purchase Order No' },
    { key: 'supplierName', label: 'Supplier Name' },
    { key: 'date', label: 'Order Date' },
    { key: 'amount', label: 'Amount' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`status-badge ${val === 'Completed' ? 'completed' : 'pending'}`}>
          {val}
        </span>
      )
    }
  ];

  const purchaseFields = [
    { name: 'purchaseNo', label: 'PO Number', type: 'text', required: true, gridSpan: 6, placeholder: 'PO-2026-xxx' },
    { name: 'supplierName', label: 'Supplier Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. TechSupply Co' },
    { name: 'date', label: 'Order Date', type: 'date', required: true, gridSpan: 6 },
    { name: 'amount', label: 'Total Amount ($)', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. $1,200.00' },
    { name: 'status', label: 'Order Status', type: 'select', options: ['Completed', 'Pending', 'Cancelled'], required: true, gridSpan: 12 }
  ];

  const handleNew = () => {
    setEditingPurchase(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingPurchase(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete purchase ${row.purchaseNo}?`)) {
      setPurchases(prev => prev.filter(p => p.id !== row.id));
    }
  };

  const handleSubmit = (formData) => {
    if (editingPurchase) {
      setPurchases(prev => prev.map(p => p.id === editingPurchase.id ? { ...p, ...formData } : p));
    } else {
      setPurchases(prev => [{ id: Date.now(), ...formData }, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="purchases-page">
      <ListView
        title="Purchase Orders"
        columns={columns}
        data={purchases}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search purchase orders..."
        newButtonLabel="+ New Purchase Order"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPurchase ? "Edit Purchase Order" : "Create Purchase Order"}
      >
        <FormView
          fields={purchaseFields}
          initialValues={editingPurchase || { date: new Date().toISOString().split('T')[0] }}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingPurchase ? "Update PO" : "Save PO"}
        />
      </Modal>
    </div>
  );
};

export default PurchaseList;
