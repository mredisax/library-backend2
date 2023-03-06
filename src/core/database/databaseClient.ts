import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const initializeDatabaseClient = async (): Promise<Client> => {
  const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } =
    process.env;

  const client = new Client({
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
  });
  await client.connect();

  return client;
};

export default initializeDatabaseClient;
