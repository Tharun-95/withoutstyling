import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getIssues = async (category, status) => {
  try {
    const params = {};
    if (category) params.category = category;
    if (status) params.status = status;
    const response = await api.get('/issues', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getIssueById = async (id) => {
  try {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createIssue = async (issueData) => {
  try {
    // Determine if issueData is FormData to handle headers appropriately
    const isFormData = issueData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    
    const response = await api.post('/issues', issueData, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateIssueStatus = async (id, status) => {
  try {
    const response = await api.put(`/issues/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (role, credentials) => {
  try {
    const endpoint = role === 'admin' ? '/admin/login' : '/user/login';
    const response = await api.post(endpoint, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
