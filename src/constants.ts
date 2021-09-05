import { SignOptions } from 'jsonwebtoken';
export const AUTH_SECRET_TOKEN = 'my secret token';
export const AUTH_JWT_OPTIONS: SignOptions = {
  expiresIn: '1d',
};
