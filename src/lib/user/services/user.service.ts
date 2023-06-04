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
    'INSERT INTO users (email, password, name, lastname, address_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [email, hashedPassword, name, lastname, address_id]
  );

  if (!client) databaseClient.end();

  return userRes.rows[0];
};

const deleteUser = async (id: string, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());
  const userRes = await databaseClient.query(
    'DELETE FROM users WHERE id = $1',
    [id]
  );
  if (!client) databaseClient.end();
  return userRes.rowCount > 0;
};

const updateUser = async (user: User, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());
  const { email, name, lastname, phone, id } = user;

  const userRes = await databaseClient.query(
    'UPDATE users SET email = $1, name = $2, lastname = $3, phone=$4 WHERE id = $5',
    [email, name, lastname, phone, id]
  );
  if (!client) databaseClient.end();
  return userRes.rowCount > 0;
};

const updatePassword = async (user: User, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());
  const { password, id } = user;
  const hashedPassword = await hashPassword(password);
  const userRes = await databaseClient.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [hashedPassword, id]
  );
  if (!client) databaseClient.end();
  return userRes.rowCount > 0;
};

const loginUser = async (
  user: User
): Promise<{ token: string; user: User } | null> => {
  const { email, password } = user;
  const foundUser: User = await findUserByEmail(email);

  if (!foundUser) {
    return null;
  }

  const validPassword = await comparePasswords(password, foundUser.password);

  if (!validPassword) {
    return null;
  }

  const token = generateToken(user);

  return { token, user: foundUser };
};

export {
  findAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
  loginUser,
  deleteUser,
  updateUser,
  updatePassword,
};
