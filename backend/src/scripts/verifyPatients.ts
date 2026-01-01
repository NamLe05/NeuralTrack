import mongoose from 'mongoose';
import Patient from '../models/Patient';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neuraltrack';

const verifyData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for verification...');

    const totalCount = await Patient.countDocuments();
    const priorityCount = await Patient.countDocuments({ id: { $regex: /NT-PRIORITY/ } });
    
    console.log(`\n--- Database Status ---`);
    console.log(`Total Patients: ${totalCount}`);
    console.log(`High-Priority Demo Patients Added: ${priorityCount}`);

    console.log(`\n--- Sample High-Priority Records ---`);
    const samples = await Patient.find({ id: { $regex: /NT-PRIORITY/ } }).limit(5);
    
    samples.forEach(p => {
      const latestMoca = p.mocaTests[p.mocaTests.length - 1];
      console.log(`Name: ${p.name} | ID: ${p.id} | Latest MoCA: ${latestMoca.totalScore} | DOB: ${p.dob}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error verifying data:', error);
    process.exit(1);
  }
};

verifyData();

