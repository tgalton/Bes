export class Hearth {
  id: number;
  name: string;
  users: number[];
  imageName: string;
  adminId: number;

  constructor(
    id: number,
    name: string,
    users: number[],
    imageName: string,
    adminId: number
  ) {
    this.id = id;
    this.name = name;
    this.users = users;
    this.imageName = imageName;
    this.adminId = adminId;
  }
}
