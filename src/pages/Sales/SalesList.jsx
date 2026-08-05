import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';

export const SalesList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'invoiceNo', label: 'Invoice No' },
    { key: 'customerName', label: 'Customer' },
    { key: 'date', label: 'Invoice Date' },
    { key: 'amount', label: 'Total Amount' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`status-badge ${val === 'Paid' ? 'paid' : 'pending'}`}>
          {val}
        </span>
      )
    }
  ];

  const salesFields = [
    { name: 'invoiceNo', label: 'Invoice Number', type: 'text', required: true, gridSpan: 6, placeholder: 'INV-2026-xxx' },
    { name: 'customerName', label: 'Customer Name', type: 'select', options: ['ABC Store', 'XYZ Store', 'John Traders', 'Apex Solutions'], required: true, gridSpan: 6 },
    { name: 'date', label: 'Date', type: 'date', required: true, gridSpan: 6 },
    { name: 'amount', label: 'Total Amount ($)', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. $1,500.00' },
    { name: 'status', label: 'Payment Status', type: 'select', options: ['Paid', 'Pending', 'Overdue'], required: true, gridSpan: 12 }
  ];

  const handleNew = () => {
    setEditingSale(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingSale(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete invoice ${row.invoiceNo}?`)) {
      await apiService.delete('sales', row.id);
      setRefreshKey(k => k + 1);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingSale) {
      await apiService.update('sales', editingSale.id, formData);
    } else {
      await apiService.create('sales', formData);
    }
    setIsModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="sales-page">
      <ListView
        apiUrl="sales"
        refreshKey={refreshKey}
        title="Sales Invoices"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search invoices by number or customer..."
        newButtonLabel="+ Create Invoice"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSale ? "Edit Invoice" : "Create Sales Invoice"}
      >
        <FormView
          fields={salesFields}
          initialValues={editingSale || { date: new Date().toISOString().split('T')[0] }}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingSale ? "Update Invoice" : "Save Invoice"}
        />
      </Modal>
    </div>
  );
};

export default SalesList;
