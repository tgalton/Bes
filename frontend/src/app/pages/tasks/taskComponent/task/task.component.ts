import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-task',
  templateUrl: 'task.component.html',
  styleUrls: ['task.component.scss'],
  standalone: true,
  imports: [
    IonFab,
    IonButton,
    IonRow,
    IonCol,
    IonGrid,
    IonIcon,
    IonFabButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class TaskComponent implements OnInit {
  taskId!: number;
  taskArduousness!: number;
  taskDuration!: number;
  taskPoint!: number;
  taskValue!: number;
  taskName!: string;

  // Use required setters to have differents values for each taskForm.
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('arduousness') set TaskArduousness(value: number) {
    this.taskArduousness = value;
  }
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('duration') set TaskDuration(value: number) {
    this.taskDuration = value;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('point') set TaskPoint(value: number) {
    this.taskPoint = value;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('value') set TaskValue(value: number) {
    this.taskValue = value;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('name') set TaskName(value: string) {
    this.taskName = value;
  }

  @Output() taskSubmitted: EventEmitter<Task> = new EventEmitter<Task>();

  hidden: boolean = true;
  taskNewName: string = '';

  ngOnInit() {
    this.updateTaskPoint();
  }

  openEditTask() {
    // Used at click on button task -> change hidden taskValue task like a toggle.
    return (this.hidden = !this.hidden);
  }

  // Used for button "+" & "-"
  incrementTaskValueOnClick(): void {
    this.taskValue = this.taskValue + 1;
  }
  decrementTaskValueOnClick(): void {
    if (this.taskValue > 0) {
      this.taskValue = this.taskValue - 1;
    }
  }

  updateTaskPoint() {
    this.taskPoint = this.calculPoint(this.taskArduousness, this.taskDuration);
  }
  // Used to directly put a pointTask from Arduousness and Duration
  calculPoint(taskArduousness: number, taskDuration: number): number {
    return Math.floor(taskDuration * (1 + 0.3 * taskArduousness));
  }

  submitForm() {
    const task: Task = new Task(
      // Opérateur de coalescence nulle : si nulle ou false alors on prend l'autre.
      this.taskId,
      this.taskNewName === '' ? this.taskName : this.taskNewName,
      this.taskValue,
      this.taskPoint,
      this.taskArduousness,
      this.taskDuration
    );

    this.taskSubmitted.emit(task);
  }
}
