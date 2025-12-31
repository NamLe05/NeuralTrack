import express from 'express';
import * as mocaController from '../controllers/mocaController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.use(auth);

router.post('/:id/mocatest', mocaController.addMocaTest);
router.get('/:id/mocatest', mocaController.getMocaTests);
router.delete('/:id/mocatest/:index', mocaController.deleteMocaTest);
router.put('/:id/mocatest/:index', mocaController.updateMocaTest);

export default router;

