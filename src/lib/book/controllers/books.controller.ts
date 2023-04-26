import express from 'express';
import { Book } from '../models/book.model';
import { findBooksByCategory, createBook, findAllBooks, findBookById, findBooksByTitle } from '../services/books.service';

const router = express.Router();

router.get('/', async (req, res) => {
  const { category } = req.body;
  if(category){
    console.log("hi");
    const books = await findAllBooks();
    if(books){
      res.status(200).send(books);
    }else{
      res.status(400).send('No books found');
    }
    
  }
});

router.get('/category', async (req, res) => {
  const { category } = req.body;
  if(!category){
    return res.status(400).send('Category not provided');
  }
  const books = await findBooksByCategory(category);

  res.status(200).send(books);
});

router.get('/id', async (req, res) => {
  const { id } = req.body;
  if(!id){
    return res.status(400).send('Id not provided');
  }
  const book = await findBookById(id);

  res.status(200).send(book);
});

router.get('/title', async (req, res) => {
  const { title } = req.body;
  if(!title){
    return res.status(400).send('Title not provided');
  }
  const books = await findBooksByTitle(title);

  res.status(200).send(books);
});




router.post('/add', async (req, res) => {
  const { title, isbn, author_id, year, category } = req.body;
  const book = new Book(title, isbn, author_id, year, category);
  const createdBook = await createBook(book);
  if (!createdBook) {
    return res.status(400).send('Book already exists');
  }
  res.status(200).send(createdBook);
});


export default router;
