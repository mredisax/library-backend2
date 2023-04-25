export class Author{
    id?: string;
    first_name: string;
    last_name: string;

    constructor(first_name: string, last_name: string, id?: string){
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
    }
}