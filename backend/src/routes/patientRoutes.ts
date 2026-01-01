import express from 'express';
import * as patientController from '../controllers/patientController';
import * as mocaController from '../controllers/mocaController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.use(auth);

// Patient Profile Routes
router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

// MoCA Assessment Routes
router.post('/:id/mocatest', mocaController.addMocaTest);
router.get('/:id/mocatest', mocaController.getMocaTests);
router.delete('/:id/mocatest/:index', mocaController.deleteMocaTest);
router.put('/:id/mocatest/:index', mocaController.updateMocaTest);

export default router;

