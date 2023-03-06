import { Client } from 'pg';

import {
  comparePasswords,
  generateToken,
  hashPassword,
} from './authentication.service';
import initializeDatabaseClient from '../../../core/database/databaseClient';

const findAllUsers = async (client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());

  const usersRes = await databaseClient.query('SELECT * FROM users');

  databaseClient.end();

  return usersRes.rows;
};

const findUserById = async (id: string, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());

  const userRes = await databaseClient.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  databaseClient.end();

  return userRes.rows[0];
};

const findUserByEmail = async (email: string, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());

  const userRes = await databaseClient.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  databaseClient.end();

  return userRes.rows[0];
};

const createUser = async (email: string, password: string, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());
  const hashedPassword = await hashPassword(password);

  const userExists = await findUserByEmail(email, databaseClient);

  if (userExists) {
    return null;
  }

  const userRes = await databaseClient.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, hashedPassword]
  );

  databaseClient.end();

  return userRes.rows[0];
};

const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const validPassword = await comparePasswords(password, user.password);

  if (!validPassword) {
    return null;
  }

  const token = generateToken(user);

  return token;
};

export { findAllUsers, findUserById, findUserByEmail, createUser, loginUser };
