import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { caretDownSharp, checkmarkOutline } from 'ionicons/icons';
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: 'task.component.html',
  styleUrls: ['task.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class TaskComponent implements OnInit {
  @Input() task!: Task;
  @Input() count!: number;
  @Output() taskUpdated: EventEmitter<{ taskId: number; count: number }> =
    new EventEmitter();

  hidden: boolean = true;
  taskNewName: string = '';
  fibonacciValues: number[] = [0, 1, 2, 3, 5, 8, 13, 21];
  checkmarkColor: string = 'secondary'; // Default color for checkmark
  taskForm!: FormGroup;
  private nameUpdateSubject = new BehaviorSubject<string>('');
  private subscription = new Subscription();

  constructor(private store: Store, private taskService: TaskService) {
    addIcons({ checkmarkOutline, caretDownSharp });

    // Subscribe to name changes with debounce
    this.subscription.add(
      this.nameUpdateSubject
        .pipe(debounceTime(700), distinctUntilChanged())
        .subscribe((newName) => {
          if (newName !== this.task.name) {
            this.updateTaskName(newName);
          }
        })
    );
  }

  ngOnInit(): void {
    this.taskForm = new FormGroup({
      taskName: new FormControl(this.task.name),
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  // Handle name input changes
  onNameInputChange(event: any): void {
    this.nameUpdateSubject.next(event.target.value);
  }

  // Handle difficulty changes
  onDifficultyChange(event: any): void {
    this.task.difficulty = event.detail.value;
    this.updateTask({ difficulty: this.task.difficulty });
  }

  // Update task name with debounce and form is dirty
  updateTaskName(newName: string): void {
    if (this.taskForm.get('taskName')?.dirty) {
      this.updateTask({ name: newName });
    }
  }

  // Update task with given changes
  updateTask(changes: Partial<Task>): void {
    this.taskService.updatePossibleTask(this.task.id, changes).subscribe(
      (updatedTask) => {
        Object.assign(this.task, updatedTask);
        this.showCheckmarkSuccess();
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }

  // Show success checkmark for 2 seconds
  showCheckmarkSuccess(): void {
    this.checkmarkColor = 'success';
    setTimeout(() => {
      this.checkmarkColor = 'secondary';
    }, 2000);
  }

  submitForm() {}
}
