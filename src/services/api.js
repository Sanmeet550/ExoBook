/**
 * API Service Abstraction Layer
 * Currently returns mock data. In future, replace implementation with fetch / axios calls to FastAPI backend.
 * 
 * Example API calls:
 * - GET: apiService.get('customers')
 * - POST: apiService.create('customers', payload)
 * - PUT: apiService.update('customers', id, payload)
 * - DELETE: apiService.delete('customers', id)
 */

import * as mockData from './mockData';

export const apiService = {
  // Generic GET request handler
  get: async (resource) => {
    // Return mock data corresponding to resource
    switch (resource) {
      case 'customers': return [...mockData.initialCustomers];
      case 'states': return [...mockData.initialStates];
      case 'countries': return [...mockData.initialCountries];
      case 'items': return [...mockData.initialItems];
      case 'categories': return [...mockData.initialItemCategories];
      case 'sales': return [...mockData.initialSales];
      case 'purchases': return [...mockData.initialPurchases];
      case 'expenses': return [...mockData.initialExpenses];
      default: return [];
    }
  },

  // Future REST API endpoint connection points
  create: async (resource, data) => {
    console.log(`[API MOCK] Creating ${resource}:`, data);
    return { id: Date.now(), ...data };
  },

  update: async (resource, id, data) => {
    console.log(`[API MOCK] Updating ${resource} (${id}):`, data);
    return { id, ...data };
  },

  delete: async (resource, id) => {
    console.log(`[API MOCK] Deleting ${resource} (${id})`);
    return { success: true, id };
  }
};

export default apiService;
