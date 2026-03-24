import { Router } from 'express';
import { getProfile, updateProfile, uploadAvatar, updateSettings } from '../controllers/profileController.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);
router.put('/settings', auth, updateSettings);

export default router;
