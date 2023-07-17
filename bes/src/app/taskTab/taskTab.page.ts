import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import { Task } from '../models/Task';

@Component({
  selector: 'app-taskTab',
  templateUrl: 'taskTab.page.html',
  styleUrls: ['taskTab.page.scss'],
})
// @NgModule({
//
// })
export class taskTab {
  listOfTasks: Task[] = [
    new Task('Vaisselle', 0, 1, 1, 1),
    new Task('Aspirateur', 0, 1, 1, 1),
    new Task('Balayer', 0, 1, 1, 1),
    new Task('Courses', 0, 1, 1, 1),
    new Task('Serpillère', 0, 1, 1, 1),
    new Task('Poubelle', 0, 1, 1, 1),
    new Task('Litière', 0, 1, 1, 1),
    new Task('Point bonus', 0, 1, 1, 1),
    new Task('Nettoyer truc', 0, 1, 1, 1),
    new Task('Chercher bois', 0, 1, 1, 1),
    new Task('Ranger Linge', 0, 1, 1, 1),
  ];

  @ViewChild('dateTime', { static: false }) dateTime: IonDatetime;
  today = new Date(Date.now());

  //Form to edit task
  formEditTask = new FormControl();
  taskArduousness?: number;
  taskDuration?: number;
  taskNewName?: string;
  taskCurrentName?: string;

  updateTask(task: Task) {
    // Update the task in the list of tasks
  }

  editTask(task: Task) {
    // Save the edited task
    console.log(this.taskArduousness);
    console.log(this.taskNewName);
  }

  constructor() {
    this.dateTime = {} as IonDatetime;
  }
  ngOnInit() {}

  onClearButtonClicked() {
    this.dateTime.value = this.today.toISOString();
    this.dateTime.reset();
  }

  testType(task: Task) {}

  // Used at click on button task -> change hidden value for this specifique task like a toggle.
  // openEditTask(task: string) {
  //   this.listOfTasks = this.listOfTasks.map((t) => {
  //     if (t.name === task) {
  //       return { ...t, hidden: !t.hidden };
  //     }
  //     return t;
  //   });
  // }
}
