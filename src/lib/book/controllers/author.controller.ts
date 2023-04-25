import express from 'express';
import { Author } from '../models/author.model';
import { addAuthor, findAllAuthors } from '../services/authors.service';
//import { createUser, findAllUsers, loginUser } from '../services/user.service';

const router = express.Router();

router.get('/', async (req, res) => {

});

router.post('/add', async (req, res) => {
    const {first_name, last_name} = req.body;
    const author = new Author(first_name, last_name);
    const createdAuthor = await addAuthor(author);

  if (!createdAuthor) {
    return res.status(400).send('Book already exists');
  }
  res.status(200).send(createdAuthor);
});


export default router;
