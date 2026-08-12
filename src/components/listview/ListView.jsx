import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Pencil, Trash2, FolderOpen, AlertTriangle, RefreshCw } from 'lucide-react';
import ListHeader from './ListHeader';
import Pagination from './Pagination';
import Loader from '../common/Loader';
import axios from 'axios';

// Shared axios instance pointing at the FastAPI base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const http = axios.create({ baseURL: BASE_URL, timeout: 15000 });
import './ListView.css';

/**
 * ListView — Generic, reusable list/table component.
 *
 * Two operating modes:
 *  1. API-driven (recommended): Pass `apiUrl` and ListView fetches its own data.
 *  2. Legacy / manual:          Pass `data` array directly (backward-compatible).
 *
 * Props:
 *  @param {string}   apiUrl            Resource key or endpoint (e.g. "customers" or "/api/customers").
 *                                       When provided, ListView fetches via apiService.get().
 *  @param {Function} transformResponse Optional. (rawData) => rowArray. Transforms the API response
 *                                       before rendering. Useful when the API returns a non-flat shape.
 *  @param {number|string} refreshKey   When this value changes, ListView re-fetches from the API.
 *                                       Parents increment this after a CRUD mutation.
 *  @param {Array}    data              Legacy: pre-fetched data array (used when apiUrl is absent).
 *  @param {string}   title            Page/section title shown in the header.
 *  @param {Array}    columns          Column definitions: [{ key, label, render?, align?, width? }].
 *  @param {Function} onNew            Callback for the "+ New" button.
 *  @param {Function} onEdit           Callback when the edit icon is clicked. Receives the full row.
 *  @param {Function} onDelete         Callback when the delete icon is clicked. Receives the full row.
 *  @param {string}   searchPlaceholder Placeholder text for the search input.
 *  @param {string}   newButtonLabel   Label for the create button.
 *  @param {number}   pageSize         Rows per page (default: 10).
 */
export const ListView = ({
  // API-driven props
  apiUrl,
  transformResponse,
  refreshKey = 0,
  // Legacy prop (backward-compatible)
  data: dataProp = [],
  // UI configuration
  title,
  columns = [],
  onNew,
  onEdit,
  onDelete,
  onRowClick,
  searchPlaceholder = 'Search...',
  newButtonLabel = '+ New',
  pageSize = 10
}) => {
  // ─── API-driven state ──────────────────────────────────────────────────────
  const [fetchedData, setFetchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── UI state ─────────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Fetch data directly from the FastAPI endpoint ───────────────────────
  // apiUrl is used verbatim as the GET path, e.g. "/state/view/all".
  const fetchData = useCallback(async () => {
    if (!apiUrl) return;
    setLoading(true);
    setError(null);
    try {
      const response = await http.get(apiUrl);
      const raw = response.data;
      const rows = transformResponse ? transformResponse(raw) : raw;
      setFetchedData(Array.isArray(rows) ? rows : []);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to load data. Please try again.';
      console.error(`[ListView] Failed to fetch "${apiUrl}":`, err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, transformResponse]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]); // re-fetch whenever resource or refreshKey changes

  // ─── Active data source ───────────────────────────────────────────────────
  // When apiUrl is provided, use fetched data; otherwise fall back to the legacy data prop.
  const activeData = apiUrl ? fetchedData : dataProp;

  // ─── Client-side search filtering ─────────────────────────────────────────
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return activeData;
    const term = searchTerm.toLowerCase();
    return activeData.filter(row =>
      Object.values(row).some(value => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      })
    );
  }, [activeData, searchTerm]);

  // ─── Reset pagination on search ───────────────────────────────────────────
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // ─── Paginated slice ──────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // ─── Render helpers ───────────────────────────────────────────────────────
  const colSpan = columns.length + (onEdit || onDelete ? 1 : 0);

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={colSpan} className="empty-cell">
            <Loader text="Loading data..." />
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={colSpan} className="empty-cell">
            <div className="error-state">
              <AlertTriangle size={36} className="error-icon" />
              <p className="error-title">Something went wrong</p>
              <p className="error-subtitle">{error}</p>
              <button className="retry-btn" onClick={fetchData}>
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          </td>
        </tr>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tr>
          <td colSpan={colSpan} className="empty-cell">
            <div className="empty-state">
              <FolderOpen size={40} className="empty-icon" />
              <p className="empty-title">No records found</p>
              <p className="empty-subtitle">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : 'Get started by creating a new entry.'}
              </p>
            </div>
          </td>
        </tr>
      );
    }

    return paginatedData.map((row, index) => (
      <tr
        key={row.id ?? index}
        onClick={() => onRowClick && onRowClick(row)}
        className={onRowClick ? 'clickable-row' : ''}
      >
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(row);
                  }}
                  title="Edit"
                  aria-label="Edit item"
                >
                  <Pencil size={15} />
                </button>
              )}
              {onDelete && (
                <button
                  className="action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(row);
                  }}
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
    ));
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="listview-wrapper">
      {title && (
        <ListHeader
          title={title}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder={searchPlaceholder}
          onNew={onNew}
          newButtonLabel={newButtonLabel}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      <div className="listview-card">
        <div className="table-responsive">
          <table className="listview-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key || col.label}
                    style={{ textAlign: col.align || 'left', width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && <th className="actions-header">ACTIONS</th>}
              </tr>
            </thead>
            <tbody>
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListView;
