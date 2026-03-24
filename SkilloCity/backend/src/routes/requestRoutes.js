import { Router } from 'express';
import { getRequests, createRequest, acceptRequest, declineRequest } from '../controllers/requestController.js';
import { auth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', auth, getRequests);
router.post('/', auth, requireRole('student'), upload.single('attachment'), createRequest);
router.put('/:id/accept', auth, requireRole('teacher'), acceptRequest);
router.put('/:id/decline', auth, requireRole('teacher'), declineRequest);

export default router;
