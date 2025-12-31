import { Request, Response } from 'express';
import Patient, { IPatient } from '../models/Patient';
import { runMLPrediction } from '../utils/ml';

const updatePatientMLMetrics = async (patient: IPatient) => {
  try {
    const results = await runMLPrediction(patient);
    if (results.length > 0) {
      // 1. Update individual test predictions
      // results are in the same order as sortedTests in ml.ts
      const sortedTestsIndices = patient.mocaTests
        .map((t, i) => ({ date: t.date, index: i }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      results.forEach((res, i) => {
        const originalIndex = sortedTestsIndices[i].index;
        patient.mocaTests[originalIndex].cdrPrediction = res.current_cdr;
      });

      // 2. Update top-level metrics from the latest result
      const latest = results[results.length - 1];
      patient.currentCDR = latest.current_cdr;
      patient.futureCDR = latest.future_cdr || 0;
      patient.confidence = latest.current_confidence;
      patient.declineRate = latest.decline_rate;

      await patient.save();
    }
  } catch (err) {
    console.error('Failed to update ML metrics:', err);
  }
};

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

    // Recalculate ML metrics in background or wait? 
    // User wants sync, so let's wait.
    await updatePatientMLMetrics(patient);

    res.status(201).json(patient);
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

    await updatePatientMLMetrics(patient);

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

    await updatePatientMLMetrics(patient);

    res.status(200).json(patient);
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
