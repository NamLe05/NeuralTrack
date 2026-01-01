import React from 'react';
import { Patient } from '../types';
import PatientCard from './PatientCard';

interface PatientListProps {
  patients: Patient[];
}

const PatientList: React.FC<PatientListProps> = ({ patients }) => {
  if (!Array.isArray(patients) || patients.length === 0) {
    return <p className="text-gray-500">No patients found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};

export default PatientList;

