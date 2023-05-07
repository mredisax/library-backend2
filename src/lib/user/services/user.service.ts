import { Client } from 'pg';

import {
  comparePasswords,
  generateToken,
  hashPassword,
} from './authentication.service';
import initializeDatabaseClient from '../../../core/database/databaseClient';
import { User } from '../models/user.model';

const findAllUsers = async (client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());

  const usersRes = await databaseClient.query('SELECT * FROM users');

  if (!client) databaseClient.end();

  return usersRes.rows;
};

const findUserById = async (id: string, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());

  const userRes = await databaseClient.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  if (!client) databaseClient.end();

  return userRes.rows[0];
};

const findUserByEmail = async (email: string, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());

  const userRes = await databaseClient.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (!client) databaseClient.end();

  return userRes.rows[0];
};

const createUser = async (user: User, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());
  const { email, password, name, lastname, address_id } = user;
  const hashedPassword = await hashPassword(password);

  const userExists = await findUserByEmail(email, databaseClient);

  if (userExists) {
    return null;
  }

  const userRes = await databaseClient.query(
    'INSERT INTO users (email, password, name, lastname, address_id) VALUES ($1, $2) RETURNING *',
    [email, hashedPassword, name, lastname, address_id]
  );

  if (!client) databaseClient.end();

  return userRes.rows[0];
};

const loginUser = async (user: User) => {
  const { email, password } = user;
  const foundUser = await findUserByEmail(email);

  if (!foundUser) {
    return null;
  }

  const validPassword = await comparePasswords(password, foundUser.password);

  if (!validPassword) {
    return null;
  }

  const token = generateToken(user);

  return token;
};

export { findAllUsers, findUserById, findUserByEmail, createUser, loginUser };
