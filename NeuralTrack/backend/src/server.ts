import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import patientRoutes from './routes/patientRoutes';
import mocaRoutes from './routes/mocaRoutes';
import authRoutes from './routes/authRoutes';
import connectDB from './utils/db';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/patients', mocaRoutes);

// Health Check
app.get('/health', (req, res) => res.send('NeuralTrack API is running...'));

// Connect to DB and Start Server
//connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
