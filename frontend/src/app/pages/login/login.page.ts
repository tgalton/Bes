import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCol,
  IonContent,
  IonInput,
  IonItem,
  IonRow,
  IonText,
  ToastController,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state'; // Assurez-vous que le chemin est correct
import * as AuthActions from 'src/app/store/actions/auth.actions';
import { isLoggedInSelector } from 'src/app/store/selectors/auth.selector';
import { HeaderComponent } from '../../shared/header/header.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonCol,
    IonRow,
    IonText,
    IonInput,
    IonItem,
    IonContent,
    HeaderComponent,
    ReactiveFormsModule,
    NgIf,
  ],
})
export class LoginPage {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  emailControl = this.loginForm.get('email');
  passwordControl = this.loginForm.get('password');

  constructor(
    private router: Router,
    private toastController: ToastController,
    private store: Store<AppState>
  ) {
    // Abonnement au sélecteur isLoggedIn pour rediriger si l'utilisateur est déjà connecté
    this.store.select(isLoggedInSelector).subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        // A mettre ici ou auth.effects ?
        // TODO: rediriger vers heartlist si l'utilisateur n'a aucun foyer.
        this.router.navigate(['tabs/tasktab']);
      }
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ email, password }));
    } else {
      this.presentToast('Veuillez remplir correctement tous les champs.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
      position: 'top',
    });
    toast.present();
  }
}
