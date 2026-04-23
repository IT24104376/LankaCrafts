import express from 'express';
import { verifyToken, registerTourist, loginTourist } from '../services/authService.js';

const router = express.Router();

/**
 * POST /api/tourist/register
 * Called from the frontend after Firebase creates the user account.
 * Expects the Firebase ID token in the Authorization header
 * plus all profile fields from the 3-step form in the body.
 */
router.post('/register', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Firebase ID token required in Authorization header.' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  const { uid, email: firebaseEmail } = await verifyToken(idToken);

  const tourist = await registerTourist(uid, firebaseEmail, req.body);

  res.status(201).json({
    message: 'Tourist profile created successfully.',
    tourist: {
      id: tourist._id,
      fullName: tourist.fullName,
      callingName: tourist.callingName,
      email: tourist.email,
      interests: tourist.interests,
      preferredLanguages: tourist.preferredLanguages,
      preferredRegions: tourist.preferredRegions,
      idNumber: tourist.idNumber,
      dateOfBirth: tourist.dateOfBirth,
      address: tourist.address,
      savedWorkshops: tourist.savedWorkshops,
      savedCrafts: tourist.savedCrafts,
      initials: tourist.initials,
      profilePicUrl: tourist.profilePicUrl,
      reviews: tourist.reviews
    },
  });
});

/**
 * POST /api/tourist/login
 * Called after Firebase client-side sign-in to sync profile back.
 * Verifies the Firebase ID token and returns the MongoDB profile.
 */
router.post('/login', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Firebase ID token required.' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  const { uid } = await verifyToken(idToken);

  const tourist = await loginTourist(uid);

  res.json({
    message: 'Logged in successfully.',
    tourist: {
      id: tourist._id,
      fullName: tourist.fullName,
      callingName: tourist.callingName,
      email: tourist.email,
      country: tourist.country,
      interests: tourist.interests,
      preferredLanguages: tourist.preferredLanguages,
      preferredRegions: tourist.preferredRegions,
      idNumber: tourist.idNumber,
      dateOfBirth: tourist.dateOfBirth,
      address: tourist.address,
      savedWorkshops: tourist.savedWorkshops,
      savedCrafts: tourist.savedCrafts,
      initials: tourist.initials,
      profilePicUrl: tourist.profilePicUrl,
      reviews: tourist.reviews
    },
  });
});

export default router;
