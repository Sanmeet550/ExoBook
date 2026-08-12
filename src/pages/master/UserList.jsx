import React, { useState } from 'react';
import ListView from '../../components/listview/ListView';
import FormView from '../../components/formview/FormView';
import apiService from '../../services/api';

export const UserList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'User Name' },
    { key: 'login', label: 'Login / Username' }
  ];

  const userFields = [
    { name: 'name', label: 'User Name', type: 'text', required: true, gridSpan: 12, placeholder: 'e.g. John Doe' },
    { name: 'login', label: 'Login / Username', type: 'text', required: true, gridSpan: 12, placeholder: 'e.g. johndoe' }
  ];

  const handleNew = () => {
    setSelectedUser(null);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleEditRow = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async (user) => {
    const target = user || selectedUser;
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete user ${target.name}?`)) {
      try {
        await apiService.request('delete', `/delete/users/${target.id}`);
        setViewMode('list');
        setSelectedUser(null);
        setRefreshKey((k) => k + 1);
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert(error.message || 'Failed to delete user');
      }
    }
  };

  const handleDiscard = () => {
    if (selectedUser) {
      setIsEditing(false);
    } else {
      setViewMode('list');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (selectedUser) {
        const res = await apiService.request('patch', `/update/users/${selectedUser.id}`, formData);
        const updatedRecord = (res && res.id) ? res : { ...selectedUser, ...formData };
        setSelectedUser(updatedRecord);
      } else {
        const res = await apiService.request('post', '/create/users', formData);
        const newRecord = (res && res.id) ? res : { ...formData };
        setSelectedUser(newRecord);
      }
      setIsEditing(false);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error('Failed to save user:', error);
      alert(error.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="users-page">
      {viewMode === 'list' ? (
        <ListView
          apiUrl="/view/users"
          refreshKey={refreshKey}
          title="Users"
          columns={columns}
          onNew={handleNew}
          onRowClick={handleRowClick}
          onEdit={handleEditRow}
          onDelete={handleDelete}
          searchPlaceholder="Search user..."
          newButtonLabel="+ New User"
        />
      ) : (
        <FormView
          title={selectedUser ? selectedUser.name || 'User Details' : 'New User'}
          fields={userFields}
          initialValues={selectedUser || {}}
          readOnly={!isEditing}
          onEdit={handleEnableEdit}
          onNew={handleNew}
          onDelete={selectedUser ? () => handleDelete(selectedUser) : null}
          onCancel={isEditing ? handleDiscard : handleBackToList}
          onSubmit={handleSubmit}
          loading={saving}
          saveLabel={selectedUser ? 'Update User' : 'Save User'}
          cancelLabel={isEditing ? 'Discard' : 'Back to List'}
          editLabel="Edit"
          newLabel="+ New User"
        />
      )}
    </div>
  );
};

export default UserList;
