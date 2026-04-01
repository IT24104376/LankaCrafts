import { Router } from 'express';
import { getArtistById, getArtists } from '../controllers/artistController.js';

const router = Router();

router.get('/', getArtists);
router.get('/:id', getArtistById);

export default router;
