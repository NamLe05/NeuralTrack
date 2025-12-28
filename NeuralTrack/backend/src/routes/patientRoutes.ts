import express from 'express';
import * as patientController from '../controllers/patientController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.use(auth);

router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);

export default router;

