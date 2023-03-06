import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/user.model';

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePasswords = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

const generateToken = (user: User) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '15m',
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export { hashPassword, comparePasswords, generateToken, verifyToken };
