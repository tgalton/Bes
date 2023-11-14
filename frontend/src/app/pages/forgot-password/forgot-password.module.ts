import { CommonModule } from '@angular/common';
import { NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPageRoutingModule } from './forgot-password-routing.module';

import { Title } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgotPasswordPage } from './forgot-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordPageRoutingModule,
    SharedModule,
  ],
  declarations: [ForgotPasswordPage],
})
export class ForgotPasswordPageModule {}
