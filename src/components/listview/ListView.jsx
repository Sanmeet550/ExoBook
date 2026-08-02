import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, FolderOpen } from 'lucide-react';
import ListHeader from './ListHeader';
import Pagination from './Pagination';
import './ListView.css';

export const ListView = ({
  title,
  columns = [],
  data = [],
  onNew,
  onEdit,
  onDelete,
  searchPlaceholder = 'Search...',
  newButtonLabel = '+ New',
  pageSize = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Client-side search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(row => {
      return Object.values(row).some(value => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm]);

  // Reset pagination on search
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Paginated data
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="listview-wrapper">
      {/* Outer Header bar with Title, Search input & New Button */}
      {title && (
        <ListHeader
          title={title}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder={searchPlaceholder}
          onNew={onNew}
          newButtonLabel={newButtonLabel}
        />
      )}

      {/* Floating White Table Card */}
      <div className="listview-card">
        <div className="table-responsive">
          <table className="listview-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key || col.label} style={{ textAlign: col.align || 'left', width: col.width }}>
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && <th className="actions-header">ACTIONS</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr key={row.id || index}>
                    {columns.map((col) => (
                      <td key={col.key || col.label} style={{ textAlign: col.align || 'left' }}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="actions-cell">
                        <div className="action-buttons">
                          {onEdit && (
                            <button
                              className="action-btn edit-btn"
                              onClick={() => onEdit(row)}
                              title="Edit"
                              aria-label="Edit item"
                            >
                              <Pencil size={15} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              className="action-btn delete-btn"
                              onClick={() => onDelete(row)}
                              title="Delete"
                              aria-label="Delete item"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="empty-cell">
                    <div className="empty-state">
                      <FolderOpen size={40} className="empty-icon" />
                      <p className="empty-title">No records found</p>
                      <p className="empty-subtitle">
                        {searchTerm ? `No results for "${searchTerm}"` : 'Get started by creating a new entry.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Integrated Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ListView;
