import mongoose from 'mongoose';
import Doctor from '../models/Doctor';
import Patient from '../models/Patient';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neuraltrack';

const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
  'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen',
  'Charles', 'Lisa', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
  'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Timothy', 'Deborah'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const seedHighPriority = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB...');

    const demoDoctor = await Doctor.findOne({ email: 'nle7147@clinic.com' });
    if (!demoDoctor) {
      console.error('Demo doctor not found. Please run seedDemo.ts first.');
      process.exit(1);
    }

    const doctorId = demoDoctor._id;
    const highPriorityPatients = [];

    console.log('Generating 50 high-priority patients (CDR >= 1.0)...');

    for (let i = 1; i <= 50; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${fName} ${lName}`;
      const patientId = `NT-PRIORITY-${String(i).padStart(3, '0')}`;
      
      // Random age between 65 and 92 for realistic high priority
      const age = Math.floor(Math.random() * (92 - 65 + 1)) + 65;
      const year = 2025 - age;
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const dob = `${year}-${month}-${day}`;

      const sex = Math.random() > 0.5 ? 'Male' : 'Female';
      
      const mocaTests = [];
      // Start with a low score to ensure CDR >= 1.0
      // CDR 1.0 is MoCA 15-19, CDR 2.0 is MoCA < 15
      let baseScore = Math.floor(Math.random() * (19 - 8 + 1)) + 8; 
      
      for (let v = 0; v < 3; v++) {
        const visitYear = 2023 + v;
        // Moderate to rapid decline
        const score = Math.max(0, baseScore - (v * Math.floor(Math.random() * 3 + 1)));
        
        mocaTests.push({
          date: `${visitYear}-05-15`,
          totalScore: score,
          subscores: {
            visuospatialExec: Math.min(5, Math.ceil(score / 6)),
            naming: Math.min(3, Math.ceil(score / 10)),
            attention: Math.min(6, Math.ceil(score / 5)),
            language: Math.min(3, Math.ceil(score / 10)),
            abstraction: Math.min(2, Math.ceil(score / 15)),
            recall: Math.min(5, Math.ceil(score / 8)),
            orientation: Math.min(6, Math.ceil(score / 5))
          }
        });
      }

      highPriorityPatients.push({
        id: patientId,
        doctorId,
        name: fullName,
        dob,
        sex,
        address: `${Math.floor(Math.random() * 999)} High St, Clinical Heights, USA`,
        phone: `+1 (555) ${Math.floor(Math.random() * 899 + 100)}-${Math.floor(Math.random() * 8999 + 1000)}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}.${i}@example-priority.com`,
        currentCDR: baseScore < 15 ? 2.0 : 1.0,
        mocaTests
      });
    }

    await Patient.insertMany(highPriorityPatients);
    console.log('Successfully added 50 high-priority patients to the database.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding priority data:', error);
    process.exit(1);
  }
};

seedHighPriority();

