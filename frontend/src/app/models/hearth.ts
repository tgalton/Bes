import { User } from './user';

export class Hearth {
  id: number;
  name: string;
  users: Number[];

  constructor(id: number, name: string, users: Number[]) {
    this.id = id;
    this.name = name;
    this.users = users;
  }
}
