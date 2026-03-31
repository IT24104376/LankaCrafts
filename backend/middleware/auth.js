import admin from '../config/firebase.js';
import Tourist from '../models/Tourist.js';

/**
 * Middleware: verifyFirebaseToken
 * Reads the Firebase ID token from the Authorization header,
 * verifies it with Firebase Admin SDK, then loads the Tourist
 * profile from MongoDB and attaches it to req.tourist.
 */
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Authorization header must start with "Bearer ".' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify with Firebase Admin — throws if invalid / expired
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Find the tourist profile in MongoDB by Firebase UID
    const tourist = await Tourist.findOne({ firebaseUid: uid, status: 'active' });

    if (!tourist) {
      return res.status(404).json({
        error: 'Tourist profile not found or deactivated.',
        uid,
      });
    }

    req.tourist = tourist;
    req.firebaseUid = uid;
    req.firebaseEmail = email;

    next();
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    if (err.code === 'auth/argument-error' || err.code === 'auth/id-token-revoked') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    console.error('Auth middleware error:', err.message);
    return res.status(500).json({ error: 'Authentication error.' });
  }
};

export { verifyFirebaseToken };
