import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeartPage } from './hearth.page';

const routes: Routes = [
  {
    path: '',
    component: HeartPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
