export class User {
  id?: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;

  constructor(
    email: string,
    password: string,
    id?: string,
    first_name?: string,
    last_name?: string
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
  }
}
