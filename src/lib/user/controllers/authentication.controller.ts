import express from 'express';
import { User } from '../models/user.model';

import { createUser, findAllUsers, loginUser } from '../services/user.service';

const router = express.Router();

router.get('/', async (_, res) => {
  // /const users = await findAllUsers();

  res.send('Hello Authentication World!');
});

router.post('/register', async (req, res) => {
  const { email, password, name, lastname, phone, address_id } = req.body;

  if (!email || !password || !name || !lastname || !address_id) {
    return res.status(400).send('Missing required fields');
  }
  console.log(req.body);

  const user = new User(email, password, name, lastname, phone, address_id);

  const createdUser = await createUser(user);
  console.log(req.body);

  if (!createdUser) {
    return res.status(400).send('User already exists');
  }
  console.log(req.body);

  res.status(200).send(createdUser);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Missing required fields');
  }

  const user = new User(email, password);

  const loggedUser = await loginUser(user);

  if (!loggedUser) {
    return res.status(400).send('User does not exist');
  } else {
    loggedUser.user.password = '';
  }

  res.status(200).send(loggedUser);
});

export default router;
