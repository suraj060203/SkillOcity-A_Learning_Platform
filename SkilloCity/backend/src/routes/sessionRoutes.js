import { Router } from 'express';
import { getSessions, getSessionById, cancelSession, addNotes } from '../controllers/sessionController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, getSessions);
router.get('/:id', auth, getSessionById);
router.put('/:id/cancel', auth, cancelSession);
router.put('/:id/notes', auth, addNotes);

export default router;
