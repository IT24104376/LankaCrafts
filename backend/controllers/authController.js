import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

export const login = async (req, res) => {
  const { email, password, identifier, role: expectedRole } = req.body;
  const id = normalizeEmail(email) || String(identifier || '').trim();

  if (!id || !password) {
    return res.status(400).json({ message: 'Email/username and password are required' });
  }

  const user = await User.findOne({
    $or: [{ email: id }, { username: id.toLowerCase() }]
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (expectedRole && user.role !== expectedRole) {
    return res.status(403).json({
      message: `This account is not a ${expectedRole}. Use the correct sign-in option.`
    });
  }

  res.json({
    email: user.email,
    role: user.role,
    username: user.username || null
  });
};

export const register = async (req, res) => {
  const secret = process.env.REGISTRATION_SECRET;
  if (!secret) {
    return res.status(403).json({ message: 'Registration is disabled (set REGISTRATION_SECRET to enable).' });
  }

  const { registrationSecret, email, password, role, username } = req.body;
  if (registrationSecret !== secret) {
    return res.status(403).json({ message: 'Invalid registration secret' });
  }

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'email, password, and role are required' });
  }

  if (!['tourist', 'artist', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const normalizedEmail = normalizeEmail(email);
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const doc = {
    email: normalizedEmail,
    passwordHash,
    role
  };
  if (username && role === 'artist') {
    doc.username = String(username).trim().toLowerCase();
  }

  const user = await User.create(doc);
  res.status(201).json({ email: user.email, role: user.role, username: user.username });
};
