import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import './ListHeader.css';

export const ListHeader = ({
  title,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  onNew,
  newButtonLabel = '+ New',
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange
}) => {
  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const counterText = totalItems > 0 ? `${startItem}-${endItem} / ${totalItems}` : '0 / 0';

  return (
    <div className="list-header">
      <div className="list-header-left">
        <h1>{title}</h1>
      </div>

      <div className="list-header-center">
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
      </div>

      <div className="list-header-right">
        {onPageChange && totalItems > 0 && (
          <div className="top-pagination">
            <span className="record-counter">{counterText}</span>
            <div className="top-page-btns">
              <button
                type="button"
                className="top-page-btn"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="top-page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
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
