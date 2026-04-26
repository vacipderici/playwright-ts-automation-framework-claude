import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  baseUrl: requireEnv('BASE_URL'),
  standardUser: requireEnv('STANDARD_USER'),
  lockedUser: requireEnv('LOCKED_USER'),
  password: requireEnv('PASSWORD'),
};
