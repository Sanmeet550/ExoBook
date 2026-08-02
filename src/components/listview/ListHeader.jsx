import React from 'react';
import { Search } from 'lucide-react';
import './ListHeader.css';

export const ListHeader = ({
  title,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  onNew,
  newButtonLabel = '+ New'
}) => {
  return (
    <div className="list-header">
      <div className="list-header-title">
        <h1>{title}</h1>
      </div>

      <div className="list-header-actions">
        {onSearchChange && (
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        {onNew && (
          <button className="btn-new-item" onClick={onNew}>
            {newButtonLabel.startsWith('+') ? newButtonLabel : `+ ${newButtonLabel}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListHeader;
