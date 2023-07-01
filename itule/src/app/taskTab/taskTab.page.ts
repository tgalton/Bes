import { Component, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-taskTab',
  templateUrl: 'taskTab.page.html',
  styleUrls: ['taskTab.page.scss'],
})
export class taskTab {
  listOfTasks: { name: string; value: 0 }[] = [
    { name: 'Vaisselle', value: 0 },
    { name: 'Aspirateur', value: 0 },
    { name: 'Balayer', value: 0 },
    { name: 'Courses', value: 0 },
    { name: 'Serpillère', value: 0 },
    { name: 'Poubelle', value: 0 },
    { name: 'Litière', value: 0 },
    { name: 'Point bonus', value: 0 },
    { name: 'Nettoyer truc', value: 0 },
    { name: 'Chercher bois', value: 0 },
    { name: 'Ranger Linge', value: 0 },
    { name: 'Nettoyer sanitaires', value: 0 },
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
}
