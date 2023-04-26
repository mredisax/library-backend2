import { Client } from 'pg';
import { Author } from '../models/author.model';
import initializeDatabaseClient from '../../../core/database/databaseClient';


const findAllAuthors = async (client?: Client) => {
    const databaseClient = client ?? (await initializeDatabaseClient());
    const authorsRes = await databaseClient.query('SELECT * FROM authors');
    
    if (!client) databaseClient.end();    
    return authorsRes.rows;
}


const addAuthor = async (author: Author, client?: Client) => {
    const databaseClient = client ?? (await initializeDatabaseClient());
    const { first_name, last_name } = author;
    const authorRes = await databaseClient.query('INSERT INTO authors (name, lastname) VALUES ($1, $2) RETURNING *', [first_name, last_name]);
    if(!client) databaseClient.end();
    return authorRes.rows[0];
}

export { findAllAuthors, addAuthor };