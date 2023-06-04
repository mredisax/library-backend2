export class User {
  id?: number;
  email: string;
  password: string;
  name?: string;
  lastname?: string;
  phone?: string;
  address_id?: number;
  is_admin?: boolean;

  constructor(
    email: string,
    password: string,
    name?: string,
    lastname?: string,
    phone?: string,
    address_id?: number,
    is_admin?: boolean,
    id?: number
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.lastname = lastname;
    this.phone = phone;
    this.address_id = address_id;
    this.is_admin = is_admin;
  }
}
