import mongoose, { Schema, Document } from 'mongoose';

export interface IMocaTest {
  date: string;               // visit date or days_to_visit
  totalScore: number;         // mocatots
  subscores: {
    abstraction: number;      // mocaabst
    recall: number;           // mocarecc
    orientation: number;      // mocaorct
  };
}

export interface IPatient extends Document {
  id: string;
  name: string;
  dob: string;
  sex: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  currentCDR?: number;
  cdrSum?: number;
  mocaTests: IMocaTest[];
}

const MocaTestSchema = new Schema({
  date: { type: String, required: true },
  totalScore: { type: Number, required: true },
  subscores: {
    abstraction: { type: Number, required: true },
    recall: { type: Number, required: true },
    orientation: { type: Number, required: true }
  }
});

const PatientSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: String, required: true },
  sex: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  currentCDR: { type: Number, default: 0 },
  cdrSum: { type: Number, default: 0 },
  mocaTests: [MocaTestSchema]
});

export default mongoose.model<IPatient>('Patient', PatientSchema);

