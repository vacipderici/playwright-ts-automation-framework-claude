import { env } from '../utils/env';

export interface UserCredentials {
  username: string;
  password: string;
}

export const users = {
  standard: (): UserCredentials => ({
    username: env.standardUser,
    password: env.password,
  }),
  locked: (): UserCredentials => ({
    username: env.lockedUser,
    password: env.password,
  }),
};
