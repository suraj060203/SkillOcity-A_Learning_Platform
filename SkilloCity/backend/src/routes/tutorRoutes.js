import { Router } from 'express';
import { getTutors, getTutorById, getRecommended, searchTutors } from '../controllers/tutorController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, getTutors);
router.get('/recommended', auth, getRecommended);
router.get('/search', auth, searchTutors);
router.get('/:id', auth, getTutorById);

export default router;
