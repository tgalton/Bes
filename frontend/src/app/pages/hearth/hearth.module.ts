import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomePageRoutingModule } from './hearth-routing.module';
import { HeartPage } from './hearth.page';

@NgModule({
  declarations: [HeartPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
  ],
})
export class HearthModule {}
