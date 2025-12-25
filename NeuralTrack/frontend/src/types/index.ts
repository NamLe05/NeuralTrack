export interface MocaTest {
  date: string;
  totalScore: number;
  subscores: {
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
  cdrSum?: number;
}

