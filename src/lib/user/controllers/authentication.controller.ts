import express from 'express';
import { User } from '../models/user.model';

import { createUser, findAllUsers, loginUser } from '../services/user.service';

const router = express.Router();

router.get('/', async (_, res) => {
  const users = await findAllUsers();

  console.log(users);

  res.send('Hello Authentication World!');
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const user = new User(email, password);

  const createdUser = await createUser(user);

  if (!createdUser) {
    return res.status(400).send('User already exists');
  }

  res.status(200).send(createdUser);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = new User(email, password);

  const token = await loginUser(user);

  res.status(200).send({ token });
});

export default router;
