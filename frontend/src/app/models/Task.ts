export class Task {
  public id: number;
  public name: string;
  public value: number;
  public point: number;
  public arduousness: number;
  public duration: number;

  constructor(
    id: number,
    name: string,
    value: number,
    point: number,
    arduousness: number,
    duration: number
  ) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.point = point;
    this.arduousness = arduousness;
    this.duration = duration;
  }
  // Déclarez des méthodes si nécessaire
}