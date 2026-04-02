const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const buildHeaders = (customHeaders = {}) => {
  const headers = { 'Content-Type': 'application/json', ...customHeaders };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const apiGet = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: buildHeaders()
  });
  return res.json();
};

export const apiPost = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body)
  });
  return res.json();
};

export const apiPut = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(body)
  });
  return res.json();
};
