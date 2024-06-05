export class Hearth {
  id: number;
  name: string;
  hearthUsers: HearthUser[];
  imageName: string;
  adminId: number;

  constructor(
    id: number,
    name: string,
    hearthUsers: HearthUser[],
    imageName: string,
    adminId: number
  ) {
    this.id = id;
    this.name = name;
    this.hearthUsers = hearthUsers;
    this.imageName = imageName;
    this.adminId = adminId;
  }
}

export class HearthUser {
  id: number;
  name: string | undefined;
  avatar: string | undefined;
  constructor(
    id: number,
    name: string | undefined,
    avatar: string | undefined
  ) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
  }
}
