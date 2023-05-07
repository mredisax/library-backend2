import express from 'express';
import { Borrow } from '../models/borrow.model';
import { findBorrowsByUserId, createBorrow, extendBorrow, deleteBorrow, findBorrowByBookId } from '../services/borrow.service';
const router = express.Router();

router.get('/user', async (req, res) => {
    const { user_id } = req.body;
    if(!user_id){
        return res.status(400).send('User id not provided');
    }
    const borrow = await findBorrowsByUserId(user_id);
    if(!borrow){
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

router.delete('/', async (req, res) => {
    const { book_id } = req.body;
    const borrow = await deleteBorrow(book_id);
    if (!borrow) {
        return res.status(400).send('Borrow does not exist');
    }
    res.status(200).send(borrow);
});

router.put('/extend', async (req, res) => {
    const { book_id } = req.body;
    const borrow = await extendBorrow(book_id);
    if (!borrow) {
        return res.status(400).send('Borrow does not exist');
    }
    res.status(200).send(borrow);
});

router.get('/book', async (req, res) => {
    const { book_id } = req.body;
    if(!book_id){
        return res.status(400).send('Book id not provided');
    }
    const borrow = await findBorrowByBookId(book_id);
    if(!borrow){
        return res.status(400).send('No borrows found');
    }
    res.status(200).send(borrow);
});

export default router;