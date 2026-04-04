// API Configuration for Tourist Safety Application
export const API_BASE_URL = 'http://localhost:5000/api';

// Get authorization token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with authorization
export const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_ME: `${API_BASE_URL}/auth/me`,
  AUTH_UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,
  AUTH_CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,

  // Trusted Contacts
  CONTACTS_LIST: `${API_BASE_URL}/contacts`,
  CONTACTS_CREATE: `${API_BASE_URL}/contacts`,
  CONTACTS_GET: (id) => `${API_BASE_URL}/contacts/${id}`,
  CONTACTS_UPDATE: (id) => `${API_BASE_URL}/contacts/${id}`,
  CONTACTS_DELETE: (id) => `${API_BASE_URL}/contacts/${id}`,
  CONTACTS_SET_PRIMARY: (id) => `${API_BASE_URL}/contacts/${id}/set-primary`,

  // Evidence
  EVIDENCE_UPLOAD: `${API_BASE_URL}/evidence/upload`,
  EVIDENCE_USER_LIST: `${API_BASE_URL}/evidence/user/all`,
  EVIDENCE_PUBLIC_LIST: `${API_BASE_URL}/evidence/public/all`,
  EVIDENCE_GET: (id) => `${API_BASE_URL}/evidence/${id}`,
  EVIDENCE_DELETE: (id) => `${API_BASE_URL}/evidence/${id}`,
  EVIDENCE_UPDATE_STATUS: (id) => `${API_BASE_URL}/evidence/${id}/status`,

  // Blood Donors
  DONORS_SEARCH: `${API_BASE_URL}/blood/donors/search`,
  DONORS_AVAILABLE: `${API_BASE_URL}/blood/donors/available/all`,
  DONORS_REGISTER: `${API_BASE_URL}/blood/donors/register`,
  DONORS_PROFILE: `${API_BASE_URL}/blood/donors/profile/me`,
  DONORS_UPDATE_AVAILABILITY: `${API_BASE_URL}/blood/donors/availability/update`,
  DONORS_RECORD_DONATION: `${API_BASE_URL}/blood/donors/donation/record`,
  DONORS_UPDATE_PROFILE: `${API_BASE_URL}/blood/donors/profile/update`,
  DONORS_STATS: `${API_BASE_URL}/blood/donors/stats`,

  // Blood Banks
  BANKS_LIST: `${API_BASE_URL}/blood/banks`,
  BANKS_SEARCH: `${API_BASE_URL}/blood/banks/search`,
  BANKS_CREATE: `${API_BASE_URL}/blood/banks`,
  BANKS_GET: (id) => `${API_BASE_URL}/blood/banks/${id}`,
  BANKS_UPDATE: (id) => `${API_BASE_URL}/blood/banks/${id}`,
  BANKS_UPDATE_INVENTORY: (id) => `${API_BASE_URL}/blood/banks/${id}/inventory`,
  BANKS_ADD_REVIEW: (id) => `${API_BASE_URL}/blood/banks/${id}/review`,
  BANKS_DELETE: (id) => `${API_BASE_URL}/blood/banks/${id}`,

  // Blood Requests
  REQUESTS_LIST: `${API_BASE_URL}/blood/requests`,
  REQUESTS_CREATE: `${API_BASE_URL}/blood/requests`,
  REQUESTS_USER_LIST: `${API_BASE_URL}/blood/requests/user/my-requests`,
  REQUESTS_GET: (id) => `${API_BASE_URL}/blood/requests/${id}`,
  REQUESTS_UPDATE: (id) => `${API_BASE_URL}/blood/requests/${id}`,
  REQUESTS_RESPOND: (id) => `${API_BASE_URL}/blood/requests/${id}/respond`,
  REQUESTS_UPDATE_STATUS: (id) => `${API_BASE_URL}/blood/requests/${id}/status`,
  REQUESTS_DELETE: (id) => `${API_BASE_URL}/blood/requests/${id}`,
  REQUESTS_MATCHING_DONORS: (id) => `${API_BASE_URL}/blood/requests/${id}/matching-donors`,
  REQUESTS_STATS: `${API_BASE_URL}/blood/requests/stats`,

  // SOS Alerts
  SOS_LIST: `${API_BASE_URL}/sos-alerts`,
  SOS_CREATE: `${API_BASE_URL}/sos-alerts`,
  SOS_USER_LIST: `${API_BASE_URL}/sos-alerts/user/my-alerts`,
  SOS_GET: (id) => `${API_BASE_URL}/sos-alerts/${id}`,
  SOS_UPDATE_STATUS: (id) => `${API_BASE_URL}/sos-alerts/${id}/status`,
  SOS_ADD_RESPONDENT: (id) => `${API_BASE_URL}/sos-alerts/${id}/respond`,
  SOS_DELETE: (id) => `${API_BASE_URL}/sos-alerts/${id}`,
  SOS_NEARBY: `${API_BASE_URL}/sos-alerts/nearby/search`,

  // General Alerts
  ALERTS_LIST: `${API_BASE_URL}/alerts`,
  ALERTS_ACTIVE: `${API_BASE_URL}/alerts/active/only`,
  ALERTS_CREATE: `${API_BASE_URL}/alerts`,
  ALERTS_GET: (id) => `${API_BASE_URL}/alerts/${id}`,
  ALERTS_UPDATE: (id) => `${API_BASE_URL}/alerts/${id}`,
  ALERTS_DELETE: (id) => `${API_BASE_URL}/alerts/${id}`,

  // Reports
  REPORTS_LIST: `${API_BASE_URL}/reports`,
  REPORTS_CREATE: `${API_BASE_URL}/reports`,
  REPORTS_USER_LIST: `${API_BASE_URL}/reports/user/my-reports`,
  REPORTS_GET: (id) => `${API_BASE_URL}/reports/${id}`,
  REPORTS_UPDATE: (id) => `${API_BASE_URL}/reports/${id}`,
  REPORTS_UPDATE_STATUS: (id) => `${API_BASE_URL}/reports/${id}/status`,
  REPORTS_LIKE: (id) => `${API_BASE_URL}/reports/${id}/like`,
  REPORTS_DELETE: (id) => `${API_BASE_URL}/reports/${id}`,
  REPORTS_STATS: `${API_BASE_URL}/reports/stats`,
};

// Utility function for API calls
export const apiCall = async (method, endpoint, data = null) => {
  try {
    const options = {
      method,
      headers: getHeaders(),
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API call failed');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default API_ENDPOINTS;
