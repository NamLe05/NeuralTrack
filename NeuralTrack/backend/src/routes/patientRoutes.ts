import express from 'express';
import * as patientController from '../controllers/patientController';

const router = express.Router();

router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);

export default router;

