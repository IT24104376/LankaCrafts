import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getActivityFeed, getRecentActivity } from '../controllers/activityController.js';

const router = Router();

router.use(protect);

router.get('/', getActivityFeed);
router.get('/recent', getRecentActivity);

export default router;
