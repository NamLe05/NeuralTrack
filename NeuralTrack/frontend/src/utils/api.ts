import { Patient, MocaTest } from '../types';

// In-memory store (Reset on page refresh - DONT SAVE ANYTHING)
let patients: Patient[] = [
  {
    id: 'NT-88291',
    name: 'Sarah Jenkins',
    dob: '1955-06-12',
    sex: 'Female',
    address: '742 Evergreen Terrace, Springfield',
    phone: '+1 (555) 123-4567',
    email: 's.jenkins@email.com',
    createdAt: new Date().toISOString(),
    currentCDR: 0.5,
    cdrSum: 2.5,
    mocaTests: [
      {
        date: '2023-11-10',
        totalScore: 24,
        subscores: { abstraction: 2, recall: 3, orientation: 5 }
      },
      {
        date: '2024-03-15',
        totalScore: 22,
        subscores: { abstraction: 1, recall: 2, orientation: 4 }
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
    createdAt: new Date().toISOString(),
    currentCDR: 1.0,
    cdrSum: 4.5,
    mocaTests: [
      {
        date: '2024-01-20',
        totalScore: 18,
        subscores: { abstraction: 1, recall: 1, orientation: 3 }
      }
    ]
  }
];

export const fetchPatients = async () => {
  return { data: [...patients] };
};

export const fetchPatientById = async (id: string) => {
  const patient = patients.find(p => p.id === id);
  return { data: patient ? { ...patient } : null };
};

export const addPatient = async (newPatient: Patient) => {
  const patientWithRecords = { ...newPatient, mocaTests: newPatient.mocaTests || [] };
  patients = [patientWithRecords, ...patients];
  return { data: patientWithRecords };
};

export const addMocaTest = async (patientId: string, test: MocaTest) => {
  const index = patients.findIndex(p => p.id === patientId);
  if (index !== -1) {
    patients[index].mocaTests = [...patients[index].mocaTests, test];
    // Update simple CDR stats for UI demo
    patients[index].currentCDR = Math.random() > 0.5 ? 1.0 : 0.5;
    return { data: { ...patients[index] } };
  }
  throw new Error('Patient not found');
};

export const deleteMocaTest = async (patientId: string, testIndex: number) => {
  const index = patients.findIndex(p => p.id === patientId);
  if (index !== -1) {
    const updatedTests = [...patients[index].mocaTests];
    updatedTests.splice(testIndex, 1);
    patients[index].mocaTests = updatedTests;
    return { data: { ...patients[index] } };
  }
  throw new Error('Patient not found');
};

export default {};
