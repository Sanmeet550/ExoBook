import React from 'react';
import Button from '../common/Button';
import './FormActions.css';

export const FormActions = ({
  onCancel,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  disabled = false
}) => {
  return (
    <div className="form-actions">
      {onCancel && (
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading || disabled}
        >
          {cancelLabel}
        </Button>
      )}

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={disabled}
      >
        {saveLabel}
      </Button>
    </div>
  );
};

export default FormActions;
