import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  name: string;
  specialization?: string;
  createdAt: Date;
}

const DoctorSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google users
  googleId: { type: String },
  name: { type: String, required: true },
  specialization: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);

