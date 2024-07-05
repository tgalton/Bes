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
  getAllPossibleTasks(hearthId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/api/house/${hearthId}/tasks/`);
  }

  // Méthode pour ajouter une tâche possible
  addPossibleTask(task: {
    name: string;
    house: number;
    duration: number;
    difficulty: number;
  }): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/api/tasks/possible/add/`, task);
  }

  // Méthode pour modifier une tâche possible
  updatePossibleTask(taskId: number, task: Partial<Task>): Observable<Task> {
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
      `${this.apiUrl}/api/tasks/made/date-range/?start_date=${startDate}&end_date=${endDate}&house_id=${houseId}`
    );
  }

  getMadeTasksToday(houseId: number): Observable<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    const startDate = `${today}T00:00:00Z`;
    const endDate = `${today}T23:59:59Z`;
    console.log(
      'input for getMadeTasksByDateRange : ',
      houseId,
      startDate,
      endDate
    );
    const tasksMadeToday = this.getMadeTasksByDateRange(
      houseId,
      startDate,
      endDate
    );
    console.log(tasksMadeToday);
    return tasksMadeToday;
  }

  // Méthode pour ajouter plusieurs tâches réalisées
  addMultipleMadeTasks(
    tasks: { possible_task_id: number; count: number }[]
  ): Observable<any> {
    console.log('Adding these tasks:', tasks);
    return this.http.post<any>(
      `${this.apiUrl}/api/tasks/made/create-multiple/`,
      tasks
    );
  }
}
