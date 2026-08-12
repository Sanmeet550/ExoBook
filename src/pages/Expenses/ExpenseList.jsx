import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';

export const ExpenseList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);

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
    setSelectedExpense(null);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleRowClick = (row) => {
    setSelectedExpense(row);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleEditRow = (row) => {
    setSelectedExpense(row);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async (row) => {
    const target = row || selectedExpense;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete expense ${target.expenseNo}?`)) {
      await apiService.delete('expenses', target.id);
      setViewMode('list');
      setSelectedExpense(null);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleDiscard = () => {
    if (selectedExpense) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedExpense(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (selectedExpense) {
        const updated = await apiService.update('expenses', selectedExpense.id, formData);
        const updatedRecord = (updated && updated.id) ? updated : { ...selectedExpense, ...formData };
        setSelectedExpense(updatedRecord);
      } else {
        const created = await apiService.create('expenses', formData);
        const newRecord = (created && created.id) ? created : { ...formData };
        setSelectedExpense(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error saving expense:', err);
      alert(err.message || 'Failed to save expense entry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="expenses-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="expenses"
          refreshKey={refreshKey}
          title="Business Expenses"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search expenses by voucher or category..."
          newButtonLabel="+ Record Expense"
        />
      ) : (
        <FormView
          title={selectedExpense ? selectedExpense.expenseNo || 'Expense Entry Details' : 'Record Expense Entry'}
          fields={expenseFields}
          initialValues={selectedExpense || { date: new Date().toISOString().split('T')[0] }}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedExpense ? () => handleDelete(selectedExpense) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedExpense ? 'Update Expense' : 'Save Expense'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ Record Expense"
        />
      )}
    </div>
  );
};

export default ExpenseList;
