import express from 'express';
import { Author } from '../models/author.model';
import { addAuthor, findAllAuthors, findAuthorById } from '../services/authors.service';

const router = express.Router();

router.get('/', async (req, res) => {
  const authors = await findAllAuthors();
  if(authors){
    res.status(200).send(authors);
  }else{
    res.status(400).send('No authors found');
  }
});

router.get('/id', async (req, res) => {
  const { id } = req.body;
  if(!id){
    return res.status(400).send('Id not provided');
  }
  const author = await findAuthorById(id);
  if(author){
    res.status(200).send(author);
  }else{
    res.status(400).send('No author found');
  }
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
