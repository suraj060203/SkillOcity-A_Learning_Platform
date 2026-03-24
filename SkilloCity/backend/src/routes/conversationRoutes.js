import { Router } from 'express';
import { getConversations, getMessages, sendMessage, sendFileMessage } from '../controllers/conversationController.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', auth, getConversations);
router.get('/:id/messages', auth, getMessages);
router.post('/:id/messages', auth, sendMessage);
router.post('/:id/messages/upload', auth, upload.single('attachment'), sendFileMessage);

export default router;
