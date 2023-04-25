export class Book {
    id?: string;
    title: string;
    isbn: string;
    author_id?: number;
    category?: string;
    year?: number;

    constructor(
        title: string,
        isbn: string,
        author_id?: number,
        year?: number,
        category?: string,
        id?: string
    ) {
        this.id = id;
        this.title = title;
        this.isbn = isbn;
        this.author_id = author_id;
        this.category = category;
        this.year = year;
    }

  }
  