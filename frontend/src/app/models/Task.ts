export class Task {
  public id: number;
  public name: string;
  public value: number;
  public point: number;
  public difficulty: number;
  public duration: number;
  public user!: number;
  public possible_task!: number;

  constructor(
    id: number,
    name: string,
    value: number,
    point: number,
    difficulty: number,
    duration: number,
    user: number,
    possible_task: number
  ) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.point = point;
    this.difficulty = difficulty;
    this.duration = duration;
    this.user = user;
    this.possible_task = possible_task;
  }
}
