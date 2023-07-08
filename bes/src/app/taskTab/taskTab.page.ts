import { Component, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-taskTab',
  templateUrl: 'taskTab.page.html',
  styleUrls: ['taskTab.page.scss'],
})
export class taskTab {
  listOfTasks: { name: string; value: 0; point: Number; hidden: boolean }[] = [
    { name: 'Vaisselle', value: 0, point: 1, hidden: true },
    { name: 'Aspirateur', value: 0, point: 1, hidden: true },
    { name: 'Balayer', value: 0, point: 1, hidden: true },
    { name: 'Courses', value: 0, point: 1, hidden: true },
    { name: 'Serpillère', value: 0, point: 1, hidden: true },
    { name: 'Poubelle', value: 0, point: 1, hidden: true },
    { name: 'Litière', value: 0, point: 1, hidden: true },
    { name: 'Point bonus', value: 0, point: 1, hidden: true },
    { name: 'Nettoyer truc', value: 0, point: 1, hidden: true },
    { name: 'Chercher bois', value: 0, point: 1, hidden: true },
    { name: 'Ranger Linge', value: 0, point: 1, hidden: true },
    { name: 'Nettoyer sanitaires', value: 0, point: 1, hidden: true },
  ];

  @ViewChild('dateTime', { static: false }) dateTime: IonDatetime;
  today = new Date(Date.now());

  constructor() {
    this.dateTime = {} as IonDatetime;
  }
  ngOnInit() {}

  onClearButtonClicked() {
    this.dateTime.value = this.today.toISOString();
    this.dateTime.reset();
  }
  incrementTaskValueOnClick(name: string): void {
    this.listOfTasks.forEach((task) => {
      if (task.name === name) {
        task.value++;
      }
    });
  }
  decrementTaskValueOnClick(name: string): void {
    this.listOfTasks.forEach((task) => {
      if (task.name === name) {
        if (task.value != 0) {
          task.value--;
        }
      }
    });
  }

  editTask(task: string) {}

  // Used at click on button task -> change hidden value for this specifique task like a toggle.
  openEditTask(task: string) {
    this.listOfTasks = this.listOfTasks.map((t) => {
      if (t.name === task) {
        return { ...t, hidden: !t.hidden };
      }
      return t;
    });
  }
}
