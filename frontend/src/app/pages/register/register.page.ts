import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonItem, IonInput, IonRow, IonCol, IonButton, ToastController, IonHeader, IonToolbar, IonTitle } from "@ionic/angular/standalone";
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [IonTitle, IonToolbar, IonHeader, IonRow, IonContent, IonItem, IonInput, IonRow, IonCol, IonButton, CommonModule, ReactiveFormsModule, HeaderComponent]
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private router : Router,
    private userService: UserService,
    private authService: AuthService, 
    private fb: FormBuilder,
    private toastController: ToastController) {

    // Construction du formulaire et des contraintes
    this.form = this.fb.group({
      pseudo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{5,20}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]]
    });
  }

  get f() {
    return this.form.controls;
  }

  handleSubmit() {
    if (this.form.valid) {
      const saveUser = new User(
        Math.random()*100,
        this.form.value.get('pseudo'),
        this.form.value.get('email'),
        this.form.value.get('password')
         )
      // Ajout à la base
      // TODO : vérifier l'existance d'un mail ou pseudo identique
      this.userService.addUser(saveUser)
      // Connecter l'utilisateur
      this.authService.authenticateUser(
        this.form.value.get('email'),
        this.form.value.get('password')
      )
      // Redirection vers main page
      this.router.navigate(['/tasktab']);
    } else {
      this.presentToast('Des erreurs sont présentes dans le formulaire.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
}
