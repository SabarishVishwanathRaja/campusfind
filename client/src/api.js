const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get stored JWT auth token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Common request wrapper for JSON APIs
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const message = (data && (data.error || data.message)) || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * GET request
 */
export async function apiGet(endpoint) {
  return request(endpoint, { method: 'GET' });
}

/**
 * POST request with JSON body
 */
export async function apiPost(endpoint, body = {}) {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

/**
 * PUT request with JSON body
 */
export async function apiPut(endpoint, body = {}) {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

/**
 * PATCH request with JSON body
 */
export async function apiPatch(endpoint, body = {}) {
  return request(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body)
  });
}

/**
 * DELETE request
 */
export async function apiDelete(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}

/**
 * Multipart/form-data upload request (POST or PUT)
 * Do NOT set Content-Type header so the browser sets the multipart boundary
 */
export async function apiUpload(endpoint, formData, method = 'POST') {
  const url = `${BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: formData
  });

  if (response.status === 204) {
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const message = (data && (data.error || data.message)) || `Upload failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiUpload
};
