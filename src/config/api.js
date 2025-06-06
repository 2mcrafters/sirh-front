const API_URL = 'http://localhost:8001/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    LOGOUT: `${API_URL}/auth/logout`,
    CURRENT_USER: `${API_URL}/auth/me`,
  },

  // Users
  USERS: {
    BASE: `${API_URL}/employes`,
    BY_ID: (id) => `${API_URL}/employes/${id}`,
  },

  // Departments
  DEPARTMENTS: {
    BASE: `${API_URL}/departements`,
    BY_ID: (id) => `${API_URL}/departements/${id}`,
  },

  // Time Tracking (Pointages)
  POINTAGES: {
    BASE: `${API_URL}/pointages`,
    BY_ID: (id) => `${API_URL}/pointages/${id}`,
  },

  // Absence Requests
  ABSENCE_REQUESTS: {
    BASE: `${API_URL}/absences`,
    BY_ID: (id) => `${API_URL}/absences/${id}`,
    STATUS: (id) => `${API_URL}/absences/${id}/status`,
  },
};

export default API_ENDPOINTS; 