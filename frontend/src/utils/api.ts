import axios from 'axios';
import { Patient, MocaTest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const updatePatient = async (id: string, updatedData: any) => {
  return api.put(`/patients/${id}`, updatedData);
};

export const deletePatient = async (id: string) => {
  return api.delete(`/patients/${id}`);
};

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', {
    emailOrUsername: data.emailOrUsername,
    password: data.password
  }),
  googleLogin: (data: any) => api.post('/auth/google', data),
  getMe: () => api.get('/auth/me'),
};

export const fetchPatients = async () => {
  return api.get('/patients');
};

export const fetchPatientById = async (id: string) => {
  return api.get(`/patients/${id}`);
};

export const addPatient = async (newPatient: any) => {
  return api.post('/patients', newPatient);
};

export const addMocaTest = async (patientId: string, test: MocaTest) => {
  return api.post(`/patients/${patientId}/mocatest`, test);
};

export const deleteMocaTest = async (patientId: string, testIndex: number) => {
  return api.delete(`/patients/${patientId}/mocatest/${testIndex}`);
};

export const updateMocaTest = async (patientId: string, testIndex: number, test: MocaTest) => {
  return api.put(`/patients/${patientId}/mocatest/${testIndex}`, test);
};

export default api;
