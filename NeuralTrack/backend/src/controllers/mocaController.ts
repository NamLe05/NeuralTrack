import { Request, Response } from 'express';
import Patient from '../models/Patient';

export const addMocaTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctorId = (req as any).user.id;
    const testData = req.body;

    const patient = await Patient.findOne({ id, doctorId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.mocaTests.push(testData);
    await patient.save();

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getMocaTests = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctorId = (req as any).user.id;

    const patient = await Patient.findOne({ id, doctorId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient.mocaTests);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteMocaTest = async (req: Request, res: Response) => {
  try {
    const { id, index } = req.params;
    const doctorId = (req as any).user.id;

    const patient = await Patient.findOne({ id, doctorId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const testIndex = parseInt(index);
    if (isNaN(testIndex) || testIndex < 0 || testIndex >= patient.mocaTests.length) {
      return res.status(400).json({ message: "Invalid test index" });
    }

    patient.mocaTests.splice(testIndex, 1);
    await patient.save();

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateMocaTest = async (req: Request, res: Response) => {
  try {
    const { id, index } = req.params;
    const doctorId = (req as any).user.id;
    const updateData = req.body;

    const patient = await Patient.findOne({ id, doctorId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const testIndex = parseInt(index);
    if (isNaN(testIndex) || testIndex < 0 || testIndex >= patient.mocaTests.length) {
      return res.status(400).json({ message: "Invalid test index" });
    }

    patient.mocaTests[testIndex] = { ...patient.mocaTests[testIndex], ...updateData };
    await patient.save();

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
