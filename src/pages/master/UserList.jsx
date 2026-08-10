import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import Modal from '../../components/common/Modal';
import apiService from '../../services/api';

export const UserList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { key: 'name', label: 'User Name' },
    { key: 'login', label: 'Login / Username' }
  ];

  const userFields = [
    { name: 'name', label: 'User Name', type: 'text', required: true, gridSpan: 12, placeholder: 'e.g. John Doe' },
    { name: 'login', label: 'Login / Username', type: 'text', required: true, gridSpan: 12, placeholder: 'e.g. johndoe' }
  ];

  const handleNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      try {
        await apiService.request('delete', `/delete/users/${user.id}`);
        setRefreshKey(k => k + 1);
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert(error.message || 'Failed to delete user');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingUser) {
        await apiService.request('patch', `/update/users/${editingUser.id}`, formData);
      } else {
        await apiService.request('post', '/create/users', formData);
      }
      setIsModalOpen(false);
      setRefreshKey(k => k + 1);
    } catch (error) {
      console.error('Failed to save user:', error);
      alert(error.message || 'Failed to save user');
    }
  };

  return (
    <div className="users-page">
      <ListView
        apiUrl="/view/users"
        refreshKey={refreshKey}
        title="Users"
        columns={columns}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search user..."
        newButtonLabel="+ New User"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User" : "Create User"}
      >
        <FormView
          fields={userFields}
          initialValues={editingUser || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          saveLabel={editingUser ? "Update User" : "Save User"}
        />
      </Modal>
    </div>
  );
};

export default UserList;
