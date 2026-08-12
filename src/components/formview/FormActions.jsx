import React from 'react';
import Button from '../common/Button';
import './FormActions.css';

export const FormActions = ({
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
  loading = false,
  disabled = false
}) => {
  if (readOnly) {
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
        {onEdit && (
          <Button
            type="button"
            variant="primary"
            onClick={onEdit}
            disabled={loading || disabled}
          >
            {editLabel}
          </Button>
        )}
        {onNew && (
          <Button
            type="button"
            variant="secondary"
            onClick={onNew}
            disabled={loading || disabled}
          >
            {newLabel}
          </Button>
        )}
        {onDelete && (
          <Button
            type="button"
            variant="danger"
            onClick={onDelete}
            disabled={loading || disabled}
          >
            {deleteLabel}
          </Button>
        )}
      </div>
    );
  }

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

      {onDelete && (
        <Button
          type="button"
          variant="danger"
          onClick={onDelete}
          disabled={loading || disabled}
        >
          {deleteLabel}
        </Button>
      )}
    </div>
  );
};

export default FormActions;
