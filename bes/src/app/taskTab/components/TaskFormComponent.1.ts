import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Required } from 'src/app/decorators/required';
import { Task } from 'src/app/models/Task';

@Component({
  selector: 'task-form',
  templateUrl: 'task-form.component.html',
  styleUrls: ['task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  taskId!: number;
  taskArduousness!: number;
  taskDuration!: number;
  taskPoint!: number;
  taskValue!: number;
  taskName!: string;

  // Use required setters to have differents values for each taskForm.
  @Input('id') @Required set TaskId(value: number) {
    this.taskId = value;
  }

  @Input('arduousness') @Required set TaskArduousness(value: number) {
    this.taskArduousness = value;
  }
  @Input('duration') @Required set TaskDuration(value: number) {
    this.taskDuration = value;
  }

  @Input('point') @Required set TaskPoint(value: number) {
    this.taskPoint = value;
  }

  @Input('value') @Required set TaskValue(value: number) {
    this.taskValue = value;
  }

  @Input('name') @Required set TaskName(value: string) {
    this.taskName = value;
  }
  @Output() taskSubmitted: EventEmitter<Task> = new EventEmitter<Task>();

  //   @Output() taskSubmitted: EventEmitter<Task> = new EventEmitter<Task>();
  hidden: boolean = true;
  taskNewName: string = '';

  ngOnInit() {
    this.updateTaskValue();
    console.log(this.taskName);
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

  updateTaskValue() {
    this.taskPoint = this.calculValue(this.taskArduousness, this.taskDuration);
  }
  // Used to directly put a pointValue from Arduousness and Duration
  calculValue(taskArduousness: number, taskDuration: number): number {
    return Math.floor(taskDuration * (1 + 0.3 * taskArduousness));
  }

  submitForm() {
    console.log(this.taskName);
    console.log(this.taskNewName);
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
