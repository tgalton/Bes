import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { taskTab } from './taskTab.page';

const routes: Routes = [
  {
    path: '',
    component: taskTab,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
