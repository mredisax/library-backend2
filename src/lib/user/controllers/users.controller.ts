import express from 'express';
import { User } from '../models/user.model';

import { createUser, findAllUsers, loginUser, findUserById, deleteUser, updateUser, updatePassword } from '../services/user.service';

const router = express.Router();

router.get('/', async (_, res) => {
    const users = await findAllUsers();
    res.send(users);
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await findUserById(id);
    if (!user) {
        return res.status(400).send('User does not exist');
    }
    res.status(200).send(user);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await deleteUser(id);
    if (!user) {
        return res.status(400).send('Something went wrong');
    }
    res.status(200).send(user);
});

router.put("/", async (req, res) => {
    const { email, password, name, lastname, phone, id } = req.body;
    const user = new User(email, password, name, lastname, phone, 0, false, id);
    const updatedUser = await updateUser(user);
    if (!updatedUser) {
        return res.status(400).send('Something went wrong');
    }
    res.status(200).send(updatedUser);
});

router.put("/password", async (req, res) => {
    const { password, id } = req.body;
    const user = new User("", password, "", "", "", 0, false, id);
    const updatedUser = await updatePassword(user);
    if (!updatedUser) {
        return res.status(400).send('Something went wrong');
    }
    res.status(200).send(updatedUser);
});


export default router;