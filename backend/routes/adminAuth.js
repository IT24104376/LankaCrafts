import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { login, getMe } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
