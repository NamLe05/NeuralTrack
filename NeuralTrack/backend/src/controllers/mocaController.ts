import { Request, Response } from 'express';
import Patient from '../models/Patient';

export const addMocaTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Logic to add MOCA test for patient
    res.status(201).json({ message: `Add MOCA test for patient ${id} placeholder` });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getMocaTests = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Logic to fetch MOCA tests for patient
    res.status(200).json({ message: `Fetch MOCA tests for patient ${id} placeholder` });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

