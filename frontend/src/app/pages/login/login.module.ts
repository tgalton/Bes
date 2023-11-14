import { CommonModule } from '@angular/common';
import { NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { Title } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    SharedModule,
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
