export class Borrow{
    id?: string;
    book_id: string;
    user_id: string;
    checkout_date: Date;
    return_date: Date;

    constructor(book_id: string, user_id: string, checkout_date: Date, return_date: Date, id?: string){
        this.id = id;
        this.book_id = book_id;
        this.user_id = user_id;
        this.checkout_date = checkout_date;
        this.return_date = return_date;
    }
}