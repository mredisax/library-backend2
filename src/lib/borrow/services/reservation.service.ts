import { Client } from 'pg';
import initializeDatabaseClient from '../../../core/database/databaseClient';

const findAllReservations = async (client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());
  const reservationRes = await databaseClient.query(
    'SELECT * FROM reservations'
  );
  if (!client) databaseClient.end();
  return reservationRes.rows;
};

const findReservationByBookId = async (book_id: string, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());
  const reservationRes = await databaseClient.query(
    'SELECT * FROM reservations WHERE book_id = $1 LIMIT 1',
    [book_id]
  );

  reservationRes.rows.forEach((reservation) => {
    const reservation_span = reservation.reservation_span;
    const now = new Date();
    if (now > reservation_span) {
      deleteReservation(reservation.id);
      return false;
    }
  });

  if (!client) databaseClient.end();
  return reservationRes.rows[0];
};

const findReservationsByUserId = async (user_id: string, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());
  const reservationRes = await databaseClient.query(
    'SELECT * FROM reservations WHERE user_id = $1',
    [user_id]
  );
  if (!client) databaseClient.end();
  return reservationRes.rows;
};

const createReservation = async (
  book_id: string,
  user_id: string,
  client?: Client
) => {
  const reservation = await findReservationByBookId(book_id);
  if (reservation) {
    return false;
  }

  const now = new Date();
  const reservationSpan = new Date(now.setMonth(now.getMonth() + 1));
  const reservationSpanStr = reservationSpan.toDateString().split('T')[0];
  const databaseClient = client ?? (await initializeDatabaseClient());
  const reservationRes = await databaseClient.query(
    'INSERT INTO reservations (book_id, user_id, reservation_span) VALUES ($1, $2, $3) RETURNING *',
    [book_id, user_id, reservationSpanStr]
  );
  if (!client) databaseClient.end();
  return reservationRes.rows[0];
};

const deleteReservation = async (id: string, client?: Client) => {
  const databaseClient = client ?? (await initializeDatabaseClient());
  const reservationRes = await databaseClient.query(
    'DELETE FROM reservations WHERE id = $1',
    [id]
  );
  if (!client) databaseClient.end();
  return true;
};

export {
  findReservationByBookId,
  createReservation,
  deleteReservation,
  findReservationsByUserId,
  findAllReservations,
};
