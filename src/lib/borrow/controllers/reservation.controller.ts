import express from 'express';
import { createReservation, findReservationByBookId, findReservationsByUserId } from '../services/reservation.service';
const router = express.Router();


router.get('/book', async (req, res) => {
    const { book_id } = req.body;
    if(!book_id){
        return res.status(400).send('Book id not provided');
    }
    const reservation = await findReservationByBookId(book_id);
    
    res.status(200).send(reservation);
});

router.get('/user', async (req, res) => {
    const { user_id } = req.body;
    if(!user_id){
        return res.status(400).send('User id not provided');
    }
    const reservation = await findReservationsByUserId(user_id);
    if(!reservation){
        return res.status(400).send('No reservations found');
    }
    res.status(200).send(reservation);
});

router.post('/', async (req, res) => {
    const { book_id, user_id } = req.body;
    const reservation = await createReservation(book_id, user_id);
    if (!reservation) {
        return res.status(400).send('Reservation already exists');
    }
    res.status(200).send(reservation);
});

export default router;