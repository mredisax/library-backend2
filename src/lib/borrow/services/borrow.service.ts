import { Client } from "pg";
import { Borrow } from "../models/borrow.model";
import initializeDatabaseClient from "../../../core/database/databaseClient";
import { findReservationByBookId, deleteReservation } from "./reservation.service";


const findBorrowByBookId = async (book_id: string, client?: Client) => {
    const databaseClient = client ?? (await initializeDatabaseClient());
    const borrowRes = await databaseClient.query('SELECT * FROM booking WHERE book_id = $1 LIMIT 1', [book_id]);
    if (!client) databaseClient.end();
    return borrowRes.rows[0];
}

const findBorrowsByUserId = async (user_id: string, client?: Client) => {
    const databaseClient = client ?? (await initializeDatabaseClient());
    const borrowRes = await databaseClient.query('SELECT * FROM booking WHERE user_id = $1', [user_id]);
    if (!client) databaseClient.end();
    return borrowRes.rows;
}

const createBorrow = async (book_id: string, user_id: string, client?: Client) => {
    const reservation = await findReservationByBookId(book_id);
    if(reservation){
        if(reservation.user_id !== user_id){
            return false;
        }else{
            deleteReservation(reservation.id);
        }
    }
    const borrow = await findBorrowByBookId(book_id);
    if(borrow){
        return false;
    }

    const now = new Date();

    let checkoutDate = now; //prevent from override by reference
    let returnDate = new Date(now.setMonth(now.getMonth() + 1));
    let returnDateStr = returnDate.toDateString().split('T')[0];
    const databaseClient = client ?? (await initializeDatabaseClient());
    const borrowRes = await databaseClient.query('INSERT INTO booking (book_id, user_id, return_date) VALUES ($1, $2, $3) RETURNING *', [book_id, user_id, returnDateStr]);
    if (!client) databaseClient.end();
    return borrowRes.rows[0];
}

const deleteBorrow = async (id: string, client?: Client) => {
    const databaseClient = client ?? (await initializeDatabaseClient());
    const borrowRes = await databaseClient.query('DELETE FROM booking WHERE id = $1', [id]);
    if (!client) databaseClient.end();

    return borrowRes.rowCount > 0;
}

const extendBorrow = async (id: string, client?: Client) => {
    const borrow = await findBorrowByBookId(id);
    const reservation = await findReservationByBookId(borrow.book_id);
    
    if(reservation){
        return false;
    }
    //if borrow return date is more than 1 week from now, return false
    if(borrow.return_date > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)){
        return false;
    }

    const now = new Date();
    const return_date = new Date(now.setMonth(now.getMonth() + 1));
    borrow.return_date = return_date;
    
    const databaseClient = client ?? (await initializeDatabaseClient());
    const borrowRes = await databaseClient.query('UPDATE booking SET return_date = $1 WHERE id = $2 RETURNING *', [return_date, id]);
    if (!client) databaseClient.end();
    return borrowRes.rows[0];
}

export { findBorrowByBookId, createBorrow, deleteBorrow, findBorrowsByUserId, extendBorrow };