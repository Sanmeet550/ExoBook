import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormField from './FormField';
import FormActions from './FormActions';
import './FormView.css';

// Helper to construct initial values according to field types
const getInitialValues = (fields, initialValues) => {
  const defaults = {};
  fields.forEach((field) => {
    if (initialValues && initialValues[field.name] !== undefined && initialValues[field.name] !== null) {
      defaults[field.name] = initialValues[field.name];
    } else {
      defaults[field.name] = field.type === 'checkbox' ? false : '';
    }
  });
  return defaults;
};

// Convert a snake_case field name from the API into a human-readable label.
// Examples:  country_id → "Country"   phone_code → "Phone Code"
const prettifyFieldName = (name) =>
  String(name)
    .replace(/_id$/, '')           // strip trailing _id  (country_id → country)
    .replace(/_/g, ' ')            // underscores → spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case

export const FormView = ({
  title,
  fields = [],
  initialValues = {},
  serverErrors = [],
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
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: getInitialValues(fields, initialValues)
  });

  // Track the serialized initialValues so reset() only fires when the
  // selected record actually changes, NOT on every parent re-render
  // (parent re-renders recreate the fields array reference which would
  //  otherwise trigger reset and wipe any server validation errors)
  const prevInitialValuesRef = useRef(null);

  useEffect(() => {
    const serialized = JSON.stringify(initialValues);
    if (prevInitialValuesRef.current !== serialized) {
      prevInitialValuesRef.current = serialized;
      reset(getInitialValues(fields, initialValues));
    }
  });

  // Handle server errors passed as a prop
  useEffect(() => {
    if (Array.isArray(serverErrors)) {
      serverErrors.forEach(({ field, message }) => {
        if (field && message) {
          setError(field, { type: 'server', message });
        }
      });
    }
  }, [serverErrors, setError]);

  // Holds server-error messages for fields NOT present in the form
  // (backend-only fields). These show only in the summary banner.
  const [unmatchedErrors, setUnmatchedErrors] = useState([]);

  // Known field names set for quick lookup
  const fieldNamesSet = new Set(fields.map((f) => f.name));

  const applyServerErrors = (errorsList) => {
    if (!Array.isArray(errorsList)) return;
    const unmatched = [];
    errorsList.forEach((item) => {
      const fieldName = item.field || (Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : null);
      const msg = item.message || item.msg;
      if (!msg) return;
      if (fieldName && fieldNamesSet.has(fieldName)) {
        // Field exists in form -> show error under the input
        setError(fieldName, { type: 'server', message: msg });
      } else {
        // Field not in form (backend-only) -> show in banner only
        unmatched.push({ field: fieldName || 'General', message: msg });
      }
    });
    setUnmatchedErrors(unmatched);
  };

  // Sanitize form data before sending to the API:
  // Empty string on a non-required select/number field -> null
  // This prevents "Input should be a valid integer" for optional FK fields
  const sanitizeData = (data) => {
    const cleaned = {};
    fields.forEach((field) => {
      const val = data[field.name];
      const isOptionalIntField =
        !field.required &&
        (field.type === 'select' || field.type === 'number') &&
        (val === '' || val === undefined);
      cleaned[field.name] = isOptionalIntField ? null : val;
    });
    Object.keys(data).forEach((key) => {
      if (!(key in cleaned)) cleaned[key] = data[key];
    });
    return cleaned;
  };

  const onFormSubmit = async (data) => {
    if (readOnly) return;
    if (onSubmit) {
      setUnmatchedErrors([]);
      const payload = sanitizeData(data);
      try {
        await onSubmit(payload, {
          setError: (fieldName, errorConfig) => setError(fieldName, errorConfig),
          setServerErrors: applyServerErrors
        });
      } catch (err) {
        const errList =
          err?.errors ||
          err?.response?.data?.errors ||
          (Array.isArray(err?.response?.data?.detail) ? err.response.data.detail : null);
        if (errList) {
          applyServerErrors(errList);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="formview-card card">
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

      {/* Error summary banner:
          - Server errors on visible fields (shown under input AND in banner)
          - Server errors for backend-only fields (shown in banner only) */}
      {!readOnly && (() => {
        const serverFieldErrors = fields.filter(
          (f) => errors[f.name] && errors[f.name].type === 'server'
        );
        const hasAnyErrors = serverFieldErrors.length > 0 || unmatchedErrors.length > 0;
        if (!hasAnyErrors) return null;
        return (
          <div className="form-error-summary">
            <div className="form-error-summary-title">
              The following errors were returned by the server:
            </div>
            <ul className="form-error-summary-list">
              {serverFieldErrors.map((f) => (
                <li key={f.name}>
                  <strong>{f.label || f.name}:</strong> {errors[f.name]?.message}
                </li>
              ))}
              {unmatchedErrors.map((e, i) => (
                <li key={`unmatched-${i}`}>
                  <strong>{prettifyFieldName(e.field)}:</strong> {e.message}
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      <div className="form-grid">
        {fields.map((field) => (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            rules={{
              required: field.required ? `${field.label || field.name} is required` : false,
              pattern: field.pattern,
              min: field.min,
              max: field.max,
              minLength: field.minLength,
              maxLength: field.maxLength,
              validate: field.validate
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormField
                field={{ ...field, disabled: readOnly || field.disabled }}
                value={value ?? (field.type === 'checkbox' ? false : '')}
                onChange={(_, val) => onChange(val)}
                error={readOnly ? null : error?.message}
              />
            )}
          />
        ))}
      </div>
    </form>
  );
};

export default FormView;
