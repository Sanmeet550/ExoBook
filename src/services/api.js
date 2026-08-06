/**
 * API Service — Axios-based HTTP client for the ExoBook FastAPI backend.
 *
 * Base URL is read from the VITE_API_BASE_URL environment variable so it can
 * be overridden per environment without touching this file.
 * Default: http://localhost:8000
 *
 * FastAPI URL convention used throughout the backend:
 *   GET    /{resource}/view/all          — list all records
 *   GET    /{resource}/view/{id}         — get single record
 *   POST   /{resource}/create            — create a new record
 *   PATCH  /{resource}/update/{id}       — partial update
 *   DELETE /{resource}/delete/{id}       — delete by id
 *
 * Usage examples:
 *   apiService.get('state')                        → GET /state/view/all
 *   apiService.getById('country', 3)               → GET /country/view/3
 *   apiService.create('state', payload)            → POST /state/create
 *   apiService.update('country', 2, payload)       → PATCH /country/update/2
 *   apiService.delete('state', 5)                  → DELETE /state/delete/5
 *
 * For modules whose list endpoint does not follow the /view/all convention,
 * use apiService.request() directly or pass the full path as apiUrl in ListView.
 */

import axios from 'axios';

// ─── Axios instance ────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ─── Response interceptor — unwrap data, normalise errors ────────────────────
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Surface the FastAPI error message when available
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ─── API service ──────────────────────────────────────────────────────────────
export const apiService = {
  /**
   * Fetch all records for a resource.
   * Follows the FastAPI convention: GET /{resource}/view/all
   *
   * ListView passes the full apiUrl path directly (e.g. "/state/view/all"),
   * so this method is primarily used by parent components for manual fetches.
   *
   * @param {string} resource  e.g. "state", "country", "currency"
   */
  get: (resource) => http.get(`/${resource}/view/all`),

  /**
   * Fetch a single record by id.
   * GET /{resource}/view/{id}
   */
  getById: (resource, id) => http.get(`/${resource}/view/${id}`),

  /**
   * Create a new record.
   * POST /{resource}/create
   */
  create: (resource, data) => http.post(`/${resource}/create`, data),

  /**
   * Partially update an existing record.
   * PATCH /{resource}/update/{id}
   */
  update: (resource, id, data) => http.patch(`/${resource}/update/${id}`, data),

  /**
   * Delete a record by id.
   * DELETE /{resource}/delete/{id}
   */
  delete: (resource, id) => {
    const paramName = `${resource}_id`;
    return http.delete(`/${resource}/delete`, { params: { [paramName]: id } });
  },

  /**
   * Low-level escape hatch — make any arbitrary HTTP request.
   * Useful for endpoints that don't follow the standard convention.
   *
   * @param {'get'|'post'|'patch'|'put'|'delete'} method
   * @param {string} url    Full path, e.g. "/view/users"
   * @param {object} [data] Request body (for POST / PATCH / PUT)
   */
  request: (method, url, data) => http.request({ method, url, data }),
};

export default apiService;
