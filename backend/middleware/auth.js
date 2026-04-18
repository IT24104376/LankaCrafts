import jwt from 'jsonwebtoken';
import admin from '../config/firebase.js';
import Tourist from '../models/Tourist.js';

/**
 * Middleware: protectAdmin
 * Verifies custom JWT for Admin roles.
 */
export const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token provided. Access denied.' 
    });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token.' 
    });
  }
};

/**
 * Middleware: verifyFirebaseToken
 * Verifies Firebase ID token for Tourists and loads MongoDB profile.
 */
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided. Authorization header must start with "Bearer ".' 
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Find the tourist profile in MongoDB
    const tourist = await Tourist.findOne({ firebaseUid: uid, status: 'active' });

    if (!tourist) {
      return res.status(404).json({
        error: 'Tourist profile not found or deactivated.',
        uid,
      });
    }

    // Attach data to request object
    req.tourist = tourist;
    req.firebaseUid = uid;
    req.firebaseEmail = email;

    next();
  } catch (err) {
    // Handle specific Firebase Auth errors
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