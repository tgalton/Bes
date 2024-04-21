export class User {
  id: number;
  username: string;
  email: string;
  age?: number;
  isActive?: boolean;
  password: string;
  hearths?: string[];

  constructor(
    id: number,
    username: string,
    email: string,
    password: string,
    age?: number,
    isActive?: boolean,
    hearths?: string[]
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.age = age;
    this.isActive = isActive;
    this.hearths = hearths;
  }
}
