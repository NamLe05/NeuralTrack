import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import patientRoutes from './routes/patientRoutes';
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

// Health Check
app.get('/health', (req, res) => res.send('NeuralTrack API is running...'));

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  // Connect to DB and Start Server
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
}

export default app;
