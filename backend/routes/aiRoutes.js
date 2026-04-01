import { Router } from 'express';
import { summarizeArtistReviews } from '../controllers/aiController.js';
 
const router = Router();
 
router.post('/review-summary', summarizeArtistReviews);
 
export default router;
