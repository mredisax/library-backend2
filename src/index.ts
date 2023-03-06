import express, { Express } from 'express';
import dotenv from 'dotenv';

import authenticationController from './lib/user/controllers/authentication.controller';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 2137;

app.use(express.json());

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.use('/auth', authenticationController);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
