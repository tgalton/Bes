export class User {
  // src/app/models/user.ts
  id: number;
  username: string;
  age?: number;
  isActive?: boolean;
  password: string;
  hearths?: string[];
  avatar?: string;

  constructor(
    id: number,
    username: string,
    email: string,
    password: string,
    age?: number,
    isActive?: boolean,
    hearths?: string[],
    avatar?: string
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.age = age;
    this.isActive = isActive;
    this.hearths = hearths;
    this.avatar = avatar;
  }
}
