export class Task {
  public id: number;
  public name: string;
  public value: number;
  public point: number;
  public difficulty: number;
  public duration: number;

  constructor(
    id: number,
    name: string,
    value: number,
    point: number,
    difficulty: number,
    duration: number
  ) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.point = point;
    this.difficulty = difficulty;
    this.duration = duration;
  }
  // Déclarez des méthodes si nécessaire
}
