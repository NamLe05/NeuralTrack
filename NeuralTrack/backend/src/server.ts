import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db';
import patientRoutes from './routes/patientRoutes';
import mocaRoutes from './routes/mocaRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/patients', mocaRoutes);

// Health Check
app.get('/health', (req, res) => res.send('NeuralTrack API is running...'));

// Connect to DB and Start Server
// connectDB(); // Uncomment after setting up MONGODB_URI in .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

