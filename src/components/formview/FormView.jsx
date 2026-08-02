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
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
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
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="formview-card card">
      {title && (
        <div className="formview-header">
          <h2>{title}</h2>
        </div>
      )}

      <form onSubmit={handleSubmit} className="formview-form">
        <div className="form-grid">
          {fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name]}
              onChange={handleFieldChange}
              error={errors[field.name]}
            />
          ))}
        </div>

        <FormActions
          onCancel={onCancel}
          saveLabel={saveLabel}
          cancelLabel={cancelLabel}
          loading={loading}
        />
      </form>
    </div>
  );
};

export default FormView;
