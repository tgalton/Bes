import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8000/housework';
  constructor(private http: HttpClient, private store: Store) {}

  // Méthode pour récupérer toutes les tâches possibles d'un foyer
  getAllPossibleTasks(houseId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/api/house/${houseId}/tasks/`);
  }

  // Méthode pour ajouter une tâche possible
  addPossibleTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/api/tasks/possible/add/`, task);
  }

  // Méthode pour modifier une tâche possible
  updatePossibleTask(taskId: number, task: Task): Observable<Task> {
    return this.http.put<Task>(
      `${this.apiUrl}api/tasks/possible/${taskId}`,
      task
    );
  }

  // Méthode pour récupérer toutes les tâches réalisées d'un foyer
  getMadeTasksByDateRange(
    houseId: number,
    startDate: string,
    endDate: string
  ): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrl}/made-tasks/${houseId}?start=${startDate}&end=${endDate}`
    );
  }

  // Méthode pour ajouter plusieurs tâches réalisées
  addMultipleMadeTasks(tasks: Task[]): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}api/tasks/made/create-multiple/`,
      tasks
    );
  }
}
