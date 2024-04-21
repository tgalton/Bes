import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [
    // new Task(1, "Passer l'aspirateur", 2, 30,1),
    // new Task(2, 'Ranger', 1, 20,1),
    // Ajoute d'autres tâches ici si nécessaire
  ];

  constructor() {}

  // Méthode pour récupérer toutes les tâches
  getTasksFromHearth(): Observable<Task[]> {
    return of(this.tasks);
  }

  // Autres méthodes du service...
}
