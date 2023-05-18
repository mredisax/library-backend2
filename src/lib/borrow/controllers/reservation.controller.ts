import express from 'express';
import {
  createReservation,
  deleteReservation,
  findAllReservations,
  findReservationByBookId,
  findReservationsByUserId,
} from '../services/reservation.service';
const router = express.Router();

router.get('/', async (req, res) => {
  const reservations = await findAllReservations();
  if (reservations) {
    res.status(200).send(reservations);
  } else {
    res.status(400).send('No reservations found');
  }
});

router.get('/book/:book_id', async (req, res) => {
  const { book_id } = req.params;
  if (!book_id) {
    return res.status(400).send('Book id not provided');
  }
  const reservation = await findReservationByBookId(book_id);
  if (!reservation) {
    return res.status(400).send('No reservation found');
  }
  res.status(200).send(reservation);
});

router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).send('User id not provided');
  }
  const reservation = await findReservationsByUserId(user_id);
  if (!reservation) {
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

router.post('/remove-reservation', async (req, res) => {
  const { reservation_id } = req.body;
  console.log(reservation_id);
  const reservation = await deleteReservation(reservation_id);
  if (!reservation) {
    return res.status(400).send('Reservation does not exist');
  }
  res.status(200).send(reservation);
});

export default router;
