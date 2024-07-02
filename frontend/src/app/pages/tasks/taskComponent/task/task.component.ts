import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { caretDownSharp, checkmarkOutline } from 'ionicons/icons';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-task',
  templateUrl: 'task.component.html',
  styleUrls: ['task.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TaskComponent {
  @Input() task!: Task;
  @Input() count!: number;
  @Output() taskUpdated: EventEmitter<{ taskId: number; count: number }> =
    new EventEmitter();

  hidden: boolean = true;
  taskNewName: string = '';
  fibonacciValues: number[] = [0, 1, 2, 3, 5, 8, 13, 21];

  constructor(private store: Store) {
    addIcons({ checkmarkOutline, caretDownSharp });
  }

  openEditTask() {
    // Used at click on button task -> change hidden taskValue task like a toggle.
    return (this.hidden = !this.hidden);
  }

  // Used for button "+" & "-"
  incrementTaskValueOnClick(): void {
    this.count += 1;
    console.log(`Task ${this.task.id} incremented to ${this.count}`);
    this.taskUpdated.emit({ taskId: this.task.id, count: this.count });
  }

  decrementTaskValueOnClick(): void {
    if (this.count > 0) {
      this.count -= 1;
      console.log(`Task ${this.task.id} decremented to ${this.count}`);
      this.taskUpdated.emit({ taskId: this.task.id, count: this.count });
    }
  }

  submitForm() {}

  onDifficultyChange(event: any): void {
    this.task.difficulty = event.detail.value;
  }
}
