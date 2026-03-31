import admin from '../config/firebase.js';
import Tourist from '../models/Tourist.js';

/**
 * Verify a Firebase ID token and return the decoded payload.
 * Throws with a friendly message if the token is invalid/expired.
 */
export async function verifyToken(idToken) {
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      const e = new Error('Token expired. Please log in again.');
      e.status = 401;
      throw e;
    }
    const e = new Error('Invalid or expired Firebase token.');
    e.status = 401;
    throw e;
  }
}

/**
 * Register a new tourist profile after Firebase account creation.
 * @param {string} uid - Firebase UID
 * @param {string} firebaseEmail - Email from Firebase token
 * @param {object} body - Request body fields
 */
export async function registerTourist(uid, firebaseEmail, body) {
  const existing = await Tourist.findOne({ firebaseUid: uid });
  if (existing) {
    const e = new Error('Tourist profile already exists for this account.');
    e.status = 409;
    throw e;
  }

  const {
    fullName,
    callingName,
    email,
    country,
    preferredLanguages,
    idNumber,
    dateOfBirth,
    address,
    interests,
    preferredRegions,
  } = body;

  if (!fullName || !country) {
    const e = new Error('fullName and country are required.');
    e.status = 400;
    throw e;
  }

  const tourist = await Tourist.create({
    firebaseUid: uid,
    fullName,
    callingName,
    email: email || firebaseEmail,
    country,
    preferredLanguages: preferredLanguages || [],
    idNumber: idNumber || '',
    dateOfBirth: dateOfBirth || undefined,
    address: address || {},
    interests: interests || [],
    preferredRegions: preferredRegions || [],
    profilePicUrl: '',
  });

  return tourist;
}

/**
 * Find an active tourist by Firebase UID (used on login).
 */
export async function loginTourist(uid) {
  const tourist = await Tourist.findOne({ firebaseUid: uid, status: 'active' });
  if (!tourist) {
    const e = new Error('Tourist profile not found or deactivated. Please contact support.');
    e.status = 404;
    throw e;
  }
  return tourist;
}
