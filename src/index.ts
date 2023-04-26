import express, { Express } from 'express';
import dotenv from 'dotenv';

import authenticationController from './lib/user/controllers/authentication.controller';
import booksController from './lib/book/controllers/books.controller';
import authorsController from './lib/book/controllers/author.controller';
import reservationController from './lib/borrow/controllers/reservation.controller';
import borrowController from './lib/borrow/controllers/borrow.controller';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 2137;

app.use(express.json());

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.use('/auth', authenticationController);

app.use('/books', booksController);
app.use("/authors", authorsController);
app.use("/reservation", reservationController);
app.use("/borrow", borrowController);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
