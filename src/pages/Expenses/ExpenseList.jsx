import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';

export const ExpenseList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'expenseNo', label: 'Expense No' },
    { key: 'category', label: 'Category' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'notes', label: 'Notes' }
  ];

  const expenseFields = [
    { name: 'expenseNo', label: 'Expense Voucher No', type: 'text', required: true, gridSpan: 6, placeholder: 'EXP-100' },
    { name: 'category', label: 'Expense Category', type: 'select', options: ['Office Supplies', 'Utilities', 'Travel & Rent', 'Salaries', 'Marketing'], required: true, gridSpan: 6 },
    { name: 'date', label: 'Expense Date', type: 'date', required: true, gridSpan: 6 },
    { name: 'amount', label: 'Amount ($)', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. $150.00' },
    { name: 'notes', label: 'Notes / Description', type: 'textarea', gridSpan: 12, placeholder: 'Brief note about this expense...' }
  ];

  const handleNew = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingExpense(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete expense ${row.expenseNo}?`)) {
      await apiService.delete('expenses', row.id);
      setRefreshKey(k => k + 1);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingExpense) {
      await apiService.update('expenses', editingExpense.id, formData);
    } else {
      await apiService.create('expenses', formData);
    }
    setIsModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="expenses-page">
      <ListView
        apiUrl="expenses"
        refreshKey={refreshKey}
        title="Business Expenses"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search expenses by voucher or category..."
        newButtonLabel="+ Record Expense"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? "Edit Expense Entry" : "Record Expense Entry"}
      >
        <FormView
          fields={expenseFields}
          initialValues={editingExpense || { date: new Date().toISOString().split('T')[0] }}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingExpense ? "Update Expense" : "Save Expense"}
        />
      </Modal>
    </div>
  );
};

export default ExpenseList;
