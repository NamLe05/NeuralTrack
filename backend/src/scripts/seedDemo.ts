import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Doctor from '../models/Doctor';
import Patient from '../models/Patient';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neuraltrack';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Clear existing data for demo purposes (optional)
    await Doctor.deleteMany({ email: 'nle7147@clinic.com' });
    // We don't delete all patients, just ensure our demo doctor's data is clean
    
    // 2. Create the Demo Doctor
    const hashedPassword = await bcrypt.hash('clinic123', 10);
    const demoDoctor = await Doctor.create({
      username: 'nle7147',
      email: 'nle7147@clinic.com',
      password: hashedPassword,
      name: 'Dr. Le Nam',
      specialization: 'Administrator'
    });
    console.log('Demo Doctor created:', demoDoctor.email);

    const doctorId = demoDoctor._id;

    // 3. Clear existing patients for this doctor to avoid duplicates
    await Patient.deleteMany({ doctorId });

    // 4. Create 3 Specific Demo Patients
    const demoPatientsData = [
      {
        id: 'NT-DEMO-001',
        doctorId,
        name: 'Elena Rodriguez',
        dob: '1983-05-12',
        sex: 'Female',
        address: '422 Oak Lane, Austin, TX',
        phone: '+1 (555) 010-8822',
        email: 'e.rodriguez@example.com',
        currentCDR: 0,
        mocaTests: [
          {
            date: '2023-01-10',
            totalScore: 28,
            subscores: { visuospatialExec: 5, naming: 3, attention: 6, language: 3, abstraction: 2, recall: 4, orientation: 5 }
          },
          {
            date: '2024-02-15',
            totalScore: 25,
            subscores: { visuospatialExec: 4, naming: 3, attention: 5, language: 2, abstraction: 2, recall: 4, orientation: 5 }
          },
          {
            date: '2025-01-05',
            totalScore: 22,
            subscores: { visuospatialExec: 3, naming: 2, attention: 4, language: 2, abstraction: 1, recall: 5, orientation: 5 }
          }
        ]
      },
      {
        id: 'NT-DEMO-002',
        doctorId,
        name: 'Arthur Kensington',
        dob: '1940-02-20',
        sex: 'Male',
        address: '88 Heritage Blvd, London, UK',
        phone: '+44 20 7946 0123',
        email: 'a.kensington@example.com',
        currentCDR: 0,
        mocaTests: [
          {
            date: '2022-11-20',
            totalScore: 29,
            subscores: { visuospatialExec: 5, naming: 3, attention: 6, language: 3, abstraction: 2, recall: 5, orientation: 5 }
          },
          {
            date: '2023-11-25',
            totalScore: 28,
            subscores: { visuospatialExec: 5, naming: 3, attention: 5, language: 3, abstraction: 2, recall: 5, orientation: 5 }
          },
          {
            date: '2024-12-10',
            totalScore: 29,
            subscores: { visuospatialExec: 5, naming: 3, attention: 6, language: 3, abstraction: 2, recall: 5, orientation: 5 }
          }
        ]
      },
      {
        id: 'NT-DEMO-003',
        doctorId,
        name: 'Margaret Thorne',
        dob: '1948-11-05',
        sex: 'Female',
        address: '15 Maple St, Toronto, ON',
        phone: '+1 (416) 555-0199',
        email: 'm.thorne@example.com',
        currentCDR: 1.0,
        mocaTests: [
          {
            date: '2023-05-12',
            totalScore: 18,
            subscores: { visuospatialExec: 3, naming: 2, attention: 4, language: 1, abstraction: 1, recall: 2, orientation: 5 }
          },
          {
            date: '2024-06-15',
            totalScore: 15,
            subscores: { visuospatialExec: 2, naming: 1, attention: 3, language: 1, abstraction: 1, recall: 2, orientation: 5 }
          },
          {
            date: '2025-01-12',
            totalScore: 12,
            subscores: { visuospatialExec: 1, naming: 1, attention: 2, language: 1, abstraction: 0, recall: 2, orientation: 5 }
          }
        ]
      }
    ];

    await Patient.insertMany(demoPatientsData);
    console.log('3 Demo Patients created.');

    // 5. Create 197 more unique fake patients
    console.log('Generating 197 additional fake patients...');
    const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
    
    const additionalPatients = [];
    for (let i = 1; i <= 197; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const sName = surnames[Math.floor(Math.random() * surnames.length)];
      const fullName = `${fName} ${sName}`;
      const patientId = `NT-FAKE-${String(i).padStart(3, '0')}`;
      
      // Random age between 21 and 88
      const age = Math.floor(Math.random() * (88 - 21 + 1)) + 21;
      const year = 2025 - age;
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const dob = `${year}-${month}-${day}`;

      const sex = Math.random() > 0.5 ? 'Male' : 'Female';
      
      const mocaTests = [];
      let baseScore = Math.floor(Math.random() * (30 - 22 + 1)) + 22; // Start with decent score
      for (let v = 0; v < 3; v++) {
        const visitYear = 2022 + v;
        const score = Math.max(0, baseScore - Math.floor(Math.random() * 3));
        mocaTests.push({
          date: `${visitYear}-10-10`,
          totalScore: score,
          subscores: {
            visuospatialExec: Math.min(5, Math.ceil(score / 6)),
            naming: Math.min(3, Math.ceil(score / 10)),
            attention: Math.min(6, Math.ceil(score / 5)),
            language: Math.min(3, Math.ceil(score / 10)),
            abstraction: Math.min(2, Math.ceil(score / 15)),
            recall: Math.min(5, Math.ceil(score / 6)),
            orientation: 5
          }
        });
      }

      additionalPatients.push({
        id: patientId,
        doctorId,
        name: fullName,
        dob,
        sex,
        address: `${Math.floor(Math.random() * 9999)} Main St, Anytown, USA`,
        phone: `+1 (555) ${Math.floor(Math.random() * 899 + 100)}-${Math.floor(Math.random() * 8999 + 1000)}`,
        email: `${fName.toLowerCase()}.${sName.toLowerCase()}${i}@example.com`,
        currentCDR: 0,
        mocaTests
      });

      if (i % 50 === 0) console.log(`Generated ${i} patients...`);
    }

    await Patient.insertMany(additionalPatients);
    console.log('Successfully seeded 200 patients for Dr. Le Nam.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

