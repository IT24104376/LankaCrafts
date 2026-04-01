import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../src/models/User.js';
 
dotenv.config();
 
const usage = () => {
  // eslint-disable-next-line no-console
  console.log(
    [
      'Usage:',
      '  node scripts/create-user.js --email <email> --password <password> --role <tourist|artist|admin> [--username <username>]',
      '',
      'Example:',
      '  node scripts/create-user.js --email admin@example.com --password "Passw0rd!" --role admin',
      '  node scripts/create-user.js --email nimal@example.com --password "Passw0rd!" --role artist --username nimal_fernando'
    ].join('\n')
  );
};
 
const getArg = (name) => {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
};
 
const main = async () => {
  const email = getArg('email');
  const password = getArg('password');
  const role = getArg('role');
  const username = getArg('username');
 
  if (!email || !password || !role) {
    usage();
    process.exit(1);
  }
 
  if (!['tourist', 'artist', 'admin'].includes(role)) {
    // eslint-disable-next-line no-console
    console.error('Invalid --role. Must be: tourist | artist | admin');
    process.exit(1);
  }
 
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    // eslint-disable-next-line no-console
    console.error('Missing MONGO_URI in backend/.env');
    process.exit(1);
  }
 
  await mongoose.connect(mongoUri);
 
  const normalizedEmail = String(email).trim().toLowerCase();
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    // eslint-disable-next-line no-console
    console.log(`User already exists: ${normalizedEmail}`);
    await mongoose.disconnect();
    return;
  }
 
  const passwordHash = await bcrypt.hash(String(password), 10);
  const doc = {
    email: normalizedEmail,
    passwordHash,
    role,
    ...(username ? { username: String(username).trim().toLowerCase() } : {})
  };
 
  if (doc.username && role !== 'artist') {
    // eslint-disable-next-line no-console
    console.error('--username is only supported for role=artist in this app.');
    process.exit(1);
  }
 
  await User.create(doc);
  // eslint-disable-next-line no-console
  console.log(`Created user: ${normalizedEmail} (${role})`);
 
  await mongoose.disconnect();
};
 
main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
