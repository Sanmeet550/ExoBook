import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormActions from './FormActions';
import './FormView.css';

export const FormView = ({
  title,
  fields = [],
  initialValues = {},
  onSubmit,
  onCancel,
  onEdit,
  onNew,
  onDelete,
  readOnly = false,
  saveLabel = 'Save',
  cancelLabel = 'Discard',
  editLabel = 'Edit',
  newLabel = 'New',
  deleteLabel = 'Delete',
  loading = false
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Populate default / initial values
    const defaultData = {};
    fields.forEach((field) => {
      if (initialValues[field.name] !== undefined) {
        defaultData[field.name] = initialValues[field.name];
      } else {
        defaultData[field.name] = field.type === 'checkbox' ? false : '';
      }
    });
    setFormData(defaultData);
    setErrors({});
  }, [fields, initialValues]);

  const handleFieldChange = (fieldName, value) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required) {
        const val = formData[field.name];
        if (val === undefined || val === null || (typeof val === 'string' && !val.trim())) {
          newErrors[field.name] = `${field.label || field.name} is required`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnly) return;
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formview-card card">
      <div className="formview-header">
        <div className="formview-title-container">
          {title && <h2>{title}</h2>}
          {readOnly && <span className="readonly-badge">Read Only</span>}
        </div>
        <FormActions
          onCancel={onCancel}
          onEdit={onEdit}
          onNew={onNew}
          onDelete={onDelete}
          readOnly={readOnly}
          saveLabel={saveLabel}
          cancelLabel={cancelLabel}
          editLabel={editLabel}
          newLabel={newLabel}
          deleteLabel={deleteLabel}
          loading={loading}
        />
      </div>

      <div className="form-grid">
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={{ ...field, disabled: readOnly || field.disabled }}
            value={formData[field.name]}
            onChange={handleFieldChange}
            error={readOnly ? null : errors[field.name]}
          />
        ))}
      </div>
    </form>
  );
};

export default FormView;
