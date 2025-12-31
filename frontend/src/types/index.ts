export interface MocaTest {
  date: string;
  totalScore: number;
  cdrPrediction?: number;
  subscores: {
    visuospatialExec: number;
    naming: number;
    attention: number;
    language: number;
    abstraction: number;
    recall: number;
    orientation: number;
  };
}

export interface Patient {
  _id?: string;
  id: string;
  name: string;
  dob: string;
  sex: 'Male' | 'Female' | 'Other';
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  mocaTests: MocaTest[];
  currentCDR?: number;
  futureCDR?: number;
  confidence?: number;
  declineRate?: number;
  cdrSum?: number;
}
