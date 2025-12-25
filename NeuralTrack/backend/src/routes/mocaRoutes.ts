import express from 'express';
import * as mocaController from '../controllers/mocaController';

const router = express.Router();

router.post('/:id/mocatest', mocaController.addMocaTest);
router.get('/:id/mocatest', mocaController.getMocaTests);

export default router;

