const BASE_URL = 'http://localhost:3000/api';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token: string) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');

interface FetchOptions extends RequestInit {
  data?: any;
}

export const apiClient = async (endpoint: string, options: FetchOptions = {}) => {
  const { data, headers: customHeaders, ...customOptions } = options;
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      ...headers,
      ...customHeaders,
    },
    ...customOptions,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || result.message || 'Something went wrong');
  }

  return result;
};
