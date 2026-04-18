import express from 'express';
import {
  createConversation,
  getConversations,
  getConversationMessages,
  markConversationRead,
  updateMessage,
  deleteMessage,
  sendMessage,
} from '../controllers/chatController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyFirebaseToken);
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:id/messages', getConversationMessages);
router.post('/conversations/:id/messages', sendMessage);
router.put('/conversations/:id/messages/:messageId', updateMessage);
router.delete('/conversations/:id/messages/:messageId', deleteMessage);
router.patch('/conversations/:id/read', markConversationRead);

export default router;
