export class User {
  // src/app/models/user.ts
  id: number;
  username: string;
  password?: string;
  email?: string;
  isActive?: boolean;
  hearths?: string[];
  avatar?: string;

  constructor(
    id: number,
    username: string,
    password?: string,
    email?: string,
    isActive?: boolean,
    hearths?: string[],
    avatar?: string
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
    this.hearths = hearths;
    this.avatar = avatar;
  }
}
