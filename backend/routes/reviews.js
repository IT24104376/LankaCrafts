import { Router } from 'express';
import {
  createReview,
  deleteReview,
  getAdminReviews,
  getReviews,
  markHelpful,
  moderateReview,
  replyToReview,
  updateReview
} from '../controllers/reviewController.js';

const router = Router();

router.get('/', getReviews);
router.get('/admin', getAdminReviews);
router.post('/', createReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/reply', replyToReview);
router.post('/:id/helpful', markHelpful);
router.post('/:id/moderate', moderateReview);

export default router;
