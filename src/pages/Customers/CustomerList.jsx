import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';

export const CustomerList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'country', label: 'Country' },
    { key: 'state', label: 'State' }
  ];

  const customerFields = [
    { name: 'name', label: 'Customer Name', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. ABC Store' },
    { name: 'phone', label: 'Phone Number', type: 'text', required: true, gridSpan: 6, placeholder: 'e.g. 9876543210' },
    { name: 'email', label: 'Email Address', type: 'email', gridSpan: 6, placeholder: 'e.g. info@abc.com' },
    { name: 'country', label: 'Country', type: 'select', options: ['India', 'United States', 'United Kingdom'], required: true, gridSpan: 6 },
    { name: 'state', label: 'State', type: 'select', options: ['Maharashtra', 'Gujarat', 'Karnataka', 'California'], gridSpan: 6 }
  ];

  const handleNew = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      await apiService.delete('customers', customer.id);
      setRefreshKey(k => k + 1);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingCustomer) {
      await apiService.update('customers', editingCustomer.id, formData);
    } else {
      await apiService.create('customers', formData);
    }
    setIsModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="customers-page">
      <ListView
        apiUrl="/customer/view/all"
        refreshKey={refreshKey}
        title="Customers"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search customer..."
        newButtonLabel="+ New Customer"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Edit Customer" : "Create Customer"}
      >
        <FormView
          fields={customerFields}
          initialValues={editingCustomer || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingCustomer ? "Update Customer" : "Save Customer"}
        />
      </Modal>
    </div>
  );
};

export default CustomerList;
