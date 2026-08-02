import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import { initialExpenses } from '../../services/mockData';

export const ExpenseList = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

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

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete expense ${row.expenseNo}?`)) {
      setExpenses(prev => prev.filter(e => e.id !== row.id));
    }
  };

  const handleSubmit = (formData) => {
    if (editingExpense) {
      setExpenses(prev => prev.map(e => e.id === editingExpense.id ? { ...e, ...formData } : e));
    } else {
      setExpenses(prev => [{ id: Date.now(), ...formData }, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="expenses-page">
      <ListView
        title="Business Expenses"
        columns={columns}
        data={expenses}
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
