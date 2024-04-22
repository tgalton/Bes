import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFabButton, IonIcon, IonGrid, IonCol, IonRow, IonButton, IonFab, IonDatetime } from '@ionic/angular/standalone';
import { Task } from 'src/app/models/task';
import { TaskComponent } from './taskComponent/task/task.component';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.page.html',
    styleUrls: ['./tasks.page.scss'],
    standalone: true,
    imports: [TaskComponent, IonFab, IonButton, IonRow, IonCol, IonGrid, IonIcon, IonFabButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent]
})

export class TasksPage {
  listOfTasks: Task[] = [
    new Task(1, 'Vaisselle', 0, 1, 1, 1),
    new Task(2, 'Aspirateur', 0, 1, 1, 1),
    new Task(3, 'Balayer', 0, 1, 1, 1),
    new Task(4, 'Courses', 0, 1, 1, 1),
    new Task(5, 'Serpillère', 0, 1, 1, 1),
    new Task(6, 'Poubelle', 0, 1, 1, 1),
    new Task(7, 'Litière', 0, 1, 1, 1),
    new Task(8, 'Point bonus', 0, 1, 1, 1),
    new Task(9, 'Nettoyer truc', 0, 1, 1, 1),
    new Task(10, 'Chercher bois', 0, 1, 1, 1),
    new Task(11, 'Ranger Linge', 0, 1, 1, 1),
  ];

  @ViewChild('dateTime', { static: false }) dateTime!: IonDatetime;
  today = new Date(Date.now());

  //Form to edit task
  formEditTask = new FormControl();
  taskId?: number;
  taskArduousness?: number;
  taskDuration?: number;
  taskNewName?: string;
  taskName?: string;
  taskCurrentName?: string;

  hiddenCreateTask: boolean = true;
  newTaskArduousness?: number;
  newTaskDuration?: number;
  newTaskPoint?: number;

  updateTask(task: Task) {
    const index = this.listOfTasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      this.listOfTasks[index] = task;
    }
    console.log(task);
    console.log(this.listOfTasks);
  }

  editTask(task: Task) {}



  // Toggle button
  onClickButtonCreate() {
    this.hiddenCreateTask = !this.hiddenCreateTask;
  }
  // Used to clear datePicker -> current date
  onClearButtonClicked() {
    this.dateTime.value = this.today.toISOString();
    this.dateTime.reset();
  }
  updateTaskPoint() {
    this.newTaskPoint = this.calculPoint(
      this.newTaskArduousness,
      this.newTaskDuration
    );
  }
  // Used to directly put a pointTask from Arduousness and Duration

  calculPoint(
    taskArduousness: number | undefined,
    taskDuration: number | undefined
  ): number {
    if (taskArduousness !== undefined && taskDuration !== undefined) {
      return Math.floor(taskDuration * (1 + 0.3 * taskArduousness));
    } else {
      return 1;
    }
  }
  onOkayButtonClicked() {}

  testType(task: Task) {}
}
