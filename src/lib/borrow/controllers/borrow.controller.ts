import express, { Request } from 'express';
import { Borrow } from '../models/borrow.model';
import {
  findBorrowsByUserId,
  createBorrow,
  extendBorrow,
  deleteBorrow,
  findBorrowByBookId,
  findBorrows,
} from '../services/borrow.service';
const router = express.Router();

router.get('/', async (req, res) => {
  const borrows = await findBorrows();
  if (borrows) {
    res.status(200).send(borrows);
  } else {
    res.status(400).send('No borrows found');
  }
});

router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).send('User id not provided');
  }
  const borrow = await findBorrowsByUserId(user_id);
  if (!borrow) {
    return res.status(400).send('No borrows found');
  }
  res.status(200).send(borrow);
});

router.post('/', async (req, res) => {
  const { book_id, user_id } = req.body;
  const borrow = await createBorrow(book_id, user_id);
  if (!borrow) {
    return res.status(400).send('Borrow is imposible to create');
  }
  res.status(200).send(borrow);
});

router.post('/delete-borrow', async (req, res) => {
  const { borrow_id } = req.body;
  const borrow = await deleteBorrow(borrow_id);
  console.log(borrow);
  if (!borrow) {
    return res.status(400).send('Borrow does not exist');
  }
  res.status(200).send(borrow);
});

router.put('/extend', async (req, res) => {
  const { borrow_id } = req.body;
  const borrow = await extendBorrow(borrow_id);
  if (!borrow) {
    return res.status(400).send('Borrow is imposible to extend');
  }
  res.status(200).send(borrow);
});

router.get(
  '/book/:book_id',
  async (
    req: Request<{
      book_id: string;
    }>,
    res
  ) => {
    const { book_id } = req.params;

    if (!book_id) {
      return res.status(400).send('Book id not provided');
    }
    const borrow = await findBorrowByBookId(book_id);
    if (!borrow) {
      return res.status(400).send('No borrows found');
    }
    res.status(200).send(borrow);
  }
);

export default router;
