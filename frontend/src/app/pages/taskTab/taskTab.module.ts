import { CommonModule } from '@angular/common';
import { NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { taskTab } from './taskTab.page';

import { Title } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaskFormComponent } from './components/TaskFormComponent.1';
import { Tab1PageRoutingModule } from './taskTab-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    SharedModule,
  ],
  declarations: [taskTab, TaskFormComponent],
})
export class TaskTab implements OnInit {
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Tâches');
    console.log(this.titleService.getTitle);
  }
}
