import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ $or: [{ email }, { username }] });
    if (existingDoctor) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new doctor
    const newDoctor = new Doctor({
      username,
      email,
      password: hashedPassword,
      name
    });

    await newDoctor.save();

    // Create token
    const token = jwt.sign({ id: newDoctor._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newDoctor._id,
        username: newDoctor.username,
        email: newDoctor.email,
        name: newDoctor.name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Find doctor by email or username
    const doctor = await Doctor.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!doctor || !doctor.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: doctor._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: doctor._id,
        username: doctor.username,
        email: doctor.email,
        name: doctor.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { googleId, email, name } = req.body;

    let doctor = await Doctor.findOne({ email });

    if (!doctor) {
      // Create new doctor for Google user
      doctor = new Doctor({
        username: email.split('@')[0], // Default username
        email,
        googleId,
        name,
        password: '' // No password for google users
      });
      await doctor.save();
    } else if (!doctor.googleId) {
      // Link google account to existing email
      doctor.googleId = googleId;
      await doctor.save();
    }

    const token = jwt.sign({ id: doctor._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: doctor._id,
        username: doctor.username,
        email: doctor.email,
        name: doctor.name
      }
    });
  } catch (error) {
    console.error('Google Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // In dev mode, if we want to stay logged in without DB, we might mock this.
    // But for now, let's assume standard token check.
    const userId = (req as any).user.id;
    const doctor = await Doctor.findById(userId).select('-password');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

