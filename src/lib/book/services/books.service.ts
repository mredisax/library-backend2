import { Client } from 'pg';
import { Book } from '../models/book.model';
import initializeDatabaseClient from '../../../core/database/databaseClient';


const findAllBooks = async (client?: Client) => {
    const databaseClient = client ?? (await initializeDatabaseClient());
    const booksRes = await databaseClient.query('SELECT * FROM books');
    
    if (!client) databaseClient.end();    
    return booksRes.rows;
}

//find book by id
const findBookById = async (id: string, client?: Client) => {
    const databaseClient = client ?? (await initializeDatabaseClient());
    const bookRes = await databaseClient.query('SELECT * FROM books WHERE id = $1 LIMIT 30 OFFSET $2', [id, 0]);
    
    if (!client) databaseClient.end();
    return bookRes.rows[0];
}

//find book by title
const findBookByTitle = async (title: string, client?: Client) => {
    const databaseClient = client ?? (await initializeDatabaseClient());
    const bookRes = await databaseClient.query('SELECT * FROM books WHERE title LIKE $1', [title]);
    
    if (!client) databaseClient.end();
    return bookRes.rows[0];
}

//find books by category
const findBooksByCategory = async (category: string, client?: Client) => {
    const databaseClient = client ?? (await initializeDatabaseClient());
    const booksRes = await databaseClient.query('SELECT * FROM books WHERE category = $1', [category]);
    
    if (!client) databaseClient.end();
    return booksRes.rows;
}

//find books by author
const findBooksByAuthor = async (author_id: number, client?: Client) => {
    const databaseClient = client ?? (await initializeDatabaseClient());
    const booksRes = await databaseClient.query('SELECT * FROM books WHERE author_id = $1', [author_id]);
    
    if (!client) databaseClient.end();
    return booksRes.rows;
}

//create book
const createBook = async (book: Book, client?: Client) => {
    const databaseClient = client ?? (await initializeDatabaseClient());
    const { title, isbn, author_id, year, category } = book;
    const bookRes = await databaseClient.query('INSERT INTO books (title, isbn, author_id, year, category) VALUES ($1, $2, $3, $4, $5) RETURNING *', [title, isbn, author_id, year, category]);
    if(!client) databaseClient.end();
    return bookRes.rows[0];
}

export { findAllBooks, findBookById, findBookByTitle, findBooksByCategory, findBooksByAuthor, createBook };
