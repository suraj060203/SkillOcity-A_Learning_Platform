import { Router } from 'express';
import { getReviews, createReview } from '../controllers/reviewController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/:teacherId', auth, getReviews);
router.post('/', auth, createReview);

export default router;
