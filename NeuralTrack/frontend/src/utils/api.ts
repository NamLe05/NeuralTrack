import axios from 'axios';
import { Patient, MocaTest } from '../types';

const API_URL = 'http://localhost:5001/api';

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

// Mock data for development when DB is not synced
const MOCK_PATIENTS = [
  {
    id: 'NT-88291',
    name: 'Sarah Jenkins',
    dob: '1955-06-12',
    sex: 'Female',
    address: '742 Evergreen Terrace, Springfield',
    phone: '+1 (555) 123-4567',
    email: 's.jenkins@email.com',
    createdAt: '2023-01-10T10:00:00Z',
    currentCDR: 0.5,
    cdrSum: 2.5,
    mocaTests: [
      {
        date: '2023-01-15',
        totalScore: 26,
        subscores: {
          visuospatialExec: 4, naming: 3, attention: 5, language: 3, abstraction: 2, recall: 4, orientation: 5
        }
      },
      {
        date: '2023-07-20',
        totalScore: 24,
        subscores: {
          visuospatialExec: 4, naming: 3, attention: 4, language: 2, abstraction: 2, recall: 4, orientation: 5
        }
      },
      {
        date: '2024-01-10',
        totalScore: 22,
        subscores: {
          visuospatialExec: 3, naming: 2, attention: 4, language: 2, abstraction: 1, recall: 3, orientation: 5
        }
      }
    ]
  },
  {
    id: 'NT-44102',
    name: 'Arthur Miller',
    dob: '1948-09-30',
    sex: 'Male',
    address: '12-B Baker Street, London',
    phone: '+1 (555) 987-6543',
    email: 'miller.a@provider.net',
    createdAt: '2023-05-15T14:30:00Z',
    currentCDR: 1.0,
    cdrSum: 4.5,
    mocaTests: [
      {
        date: '2023-06-01',
        totalScore: 20,
        subscores: {
          visuospatialExec: 3, naming: 2, attention: 4, language: 2, abstraction: 1, recall: 2, orientation: 6
        }
      },
      {
        date: '2024-01-20',
        totalScore: 18,
        subscores: {
          visuospatialExec: 2, naming: 2, attention: 3, language: 1, abstraction: 1, recall: 1, orientation: 3
        }
      }
    ]
  },
  {
    id: 'NT-99231',
    name: 'Robert Chen',
    dob: '1962-11-05',
    sex: 'Male',
    address: '88 Fortune Way, San Francisco',
    phone: '+1 (555) 444-2211',
    email: 'chen.r@biotech.com',
    createdAt: '2024-03-01T09:15:00Z',
    currentCDR: 0.0,
    cdrSum: 0.0,
    mocaTests: [
      {
        date: '2024-03-10',
        totalScore: 29,
        subscores: {
          visuospatialExec: 5, naming: 3, attention: 6, language: 3, abstraction: 2, recall: 4, orientation: 6
        }
      }
    ]
  }
];

// Helper to simulate ML predictions in Dev Mode
const simulateMLPrediction = (patient: any) => {
  if (!patient.mocaTests || patient.mocaTests.length === 0) {
    return {
      currentCDR: 0.0,
      currentConfidence: 1.0,
      futureCDR: 0.0,
      futureConfidence: 1.0,
      declineRate: 0
    };
  }
  const latestTest = patient.mocaTests[patient.mocaTests.length - 1];
  const score = latestTest.totalScore;

  // Calculate simulated decline
  let decline = 0;
  if (patient.mocaTests.length >= 2) {
    const prev = patient.mocaTests[patient.mocaTests.length - 2].totalScore;
    decline = prev - score;
  }

  // Simple heuristic mapping to match model behavior
  let currentCDR = 0.0;
  let currentConfidence = 0.85;
  if (score < 15) { currentCDR = 2.0; currentConfidence = 0.78; }
  else if (score < 20) { currentCDR = 1.0; currentConfidence = 0.82; }
  else if (score < 26) { currentCDR = 0.5; currentConfidence = 0.74; }

  // Predict future based on decline
  let futureCDR = currentCDR;
  let futureConfidence = 0.81;
  if (decline > 2 || score < 20) {
    futureCDR = Math.min(3.0, currentCDR + 0.5);
    futureConfidence = 0.76;
  }

  return {
    currentCDR,
    currentConfidence,
    futureCDR,
    futureConfidence,
    declineRate: decline
  };
};

export const updatePatient = async (id: string, updatedData: any) => {
  if (localStorage.getItem('token') === 'dev-token') {
    const index = MOCK_PATIENTS.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PATIENTS[index] = { ...MOCK_PATIENTS[index], ...updatedData };
      return { data: MOCK_PATIENTS[index] };
    }
    return { data: null };
  }
  return api.put(`/patients/${id}`, updatedData);
};

export const deletePatient = async (id: string) => {
  if (localStorage.getItem('token') === 'dev-token') {
    const index = MOCK_PATIENTS.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PATIENTS.splice(index, 1);
      return { data: { success: true } };
    }
    return { data: { success: false } };
  }
  return api.delete(`/patients/${id}`);
};

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  googleLogin: (data: any) => api.post('/auth/google', data),
  getMe: () => api.get('/auth/me'),
};

export const fetchPatients = async () => {
  if (localStorage.getItem('token') === 'dev-token') {
    return { data: MOCK_PATIENTS };
  }
  return api.get('/patients');
};

export const fetchPatientById = async (id: string) => {
  if (localStorage.getItem('token') === 'dev-token') {
    const p = MOCK_PATIENTS.find(p => p.id === id);
    return { data: p || null };
  }
  return api.get(`/patients/${id}`);
};

export const addPatient = async (newPatient: any) => {
  if (localStorage.getItem('token') === 'dev-token') {
    MOCK_PATIENTS.unshift(newPatient);
    return { data: newPatient };
  }
  return api.post('/patients', newPatient);
};

export const addMocaTest = async (patientId: string, test: MocaTest) => {
  if (localStorage.getItem('token') === 'dev-token') {
    const p = MOCK_PATIENTS.find(p => p.id === patientId);
    if (p) {
      p.mocaTests.push(test);
      const prediction = simulateMLPrediction(p);
      p.currentCDR = prediction.currentCDR;
      return { data: { ...p, mocaTests: [...p.mocaTests] } };
    }
    return { data: null };
  }
  return api.post(`/patients/${patientId}/mocatest`, test);
};

export const deleteMocaTest = async (patientId: string, testIndex: number) => {
  if (localStorage.getItem('token') === 'dev-token') {
    const p = MOCK_PATIENTS.find(p => p.id === patientId);
    if (p) {
      p.mocaTests.splice(testIndex, 1);
      const prediction = simulateMLPrediction(p);
      p.currentCDR = prediction.currentCDR;
      return { data: { ...p, mocaTests: [...p.mocaTests] } };
    }
    return { data: null };
  }
  return api.delete(`/patients/${patientId}/mocatest/${testIndex}`);
};

export const updateMocaTest = async (patientId: string, testIndex: number, test: MocaTest) => {
  if (localStorage.getItem('token') === 'dev-token') {
    const p = MOCK_PATIENTS.find(p => p.id === patientId);
    if (p) {
      p.mocaTests[testIndex] = test;
      const prediction = simulateMLPrediction(p);
      p.currentCDR = prediction.currentCDR;
      return { data: { ...p, mocaTests: [...p.mocaTests] } };
    }
    return { data: null };
  }
  return api.put(`/patients/${patientId}/mocatest/${testIndex}`, test);
};

export default api;
