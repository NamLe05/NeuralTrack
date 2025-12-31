import { Request, Response } from 'express';
import Patient from '../models/Patient';

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const doctorId = (req as any).user.id;
    const patients = await Patient.find({ doctorId });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctorId = (req as any).user.id;
    const patient = await Patient.findOne({ id, doctorId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const doctorId = (req as any).user.id;
    const patientData = { ...req.body, doctorId };
    
    const newPatient = new Patient(patientData);
    await newPatient.save();
    
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctorId = (req as any).user.id;
    const patientData = req.body;
    
    const updatedPatient = await Patient.findOneAndUpdate(
      { id, doctorId },
      patientData,
      { new: true }
    );
    
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctorId = (req as any).user.id;
    
    const deletedPatient = await Patient.findOneAndDelete({ id, doctorId });
    
    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
