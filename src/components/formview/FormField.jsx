import React from 'react';
import './FormField.css';

export const FormField = ({
  field,
  value,
  onChange,
  error
}) => {
  const {
    name,
    label,
    type = 'text',
    required = false,
    placeholder = '',
    options = [],
    rows = 3,
    gridSpan = 6, // 6 for half-width (in 12 col grid), 12 for full width
    disabled = false
  } = field;

  const handleChange = (e) => {
    const val = type === 'checkbox' ? e.target.checked : e.target.value;
    onChange(name, val);
  };

  const isFullWidth = gridSpan === 12 || type === 'textarea';

  return (
    <div className={`form-group ${isFullWidth ? 'col-12' : 'col-6'}`}>
      {type !== 'checkbox' && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          id={name}
          name={name}
          className={`form-input ${error ? 'error' : ''}`}
          value={value ?? ''}
          onChange={handleChange}
          disabled={disabled}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          className={`form-input form-textarea ${error ? 'error' : ''}`}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={handleChange}
          disabled={disabled}
        />
      ) : type === 'checkbox' ? (
        <div className="checkbox-container">
          <input
            type="checkbox"
            id={name}
            name={name}
            className="form-checkbox"
            checked={!!value}
            onChange={handleChange}
            disabled={disabled}
          />
          <label className="checkbox-label" htmlFor={name}>
            {label} {required && <span className="required-star">*</span>}
          </label>
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          className={`form-input ${error ? 'error' : ''}`}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={handleChange}
          disabled={disabled}
        />
      )}

      {error && <span className="field-error-msg">{error}</span>}
    </div>
  );
};

export default FormField;
