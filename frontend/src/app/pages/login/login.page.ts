import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonRow, IonButton, IonCol, IonInput, ToastController, IonText } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonText, IonInput, IonCol, IonButton, IonRow, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage  {

  loginError = false;
  errorField!: string;
  loginForm: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = new FormGroup({
    email: new FormControl<string | null>(''),
    password: new FormControl<string | null>('')
  });

  emailControl = this.loginForm.get('email')
  passwordControl = this.loginForm.get('password')
  
  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastController: ToastController
  ) {}

  login() {
    // Utilisation de 'get' pour accéder en toute sécurité aux contrôles
    const emailControl = this.loginForm.get('email')
    const passwordControl = this.loginForm.get('password')

    if(this.loginForm.invalid){
      // Vérification de chaque contrôle spécifiquement
      if(emailControl && emailControl.invalid){
        this.errorField = 'email';
        this.presentToast('Veuillez entrer un email valide.');
      } else if (passwordControl && passwordControl.invalid) {
        this.errorField = 'password';
        this.presentToast('Veuillez entrer un mot de passe valide.');
      }
      return
    }

      // Assurer que les contrôles ne sont pas nuls avant d'utiliser leurs valeurs
    if (emailControl && passwordControl && typeof this.loginForm.value.email === "string" && typeof this.loginForm.value.password === "string") {
      this.authenticate(this.loginForm.value.email, this.loginForm.value.password);
    } else {
      this.presentToast("Erreur interne : contrôle de formulaire manquant.");
    }
  }

  authenticate(email: string, password: string) {
    this.authService.authenticateUser(email, password).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['tabs/tasktab']);
        } else {
          this.loginError = true;
          this.presentToast("Échec de l'authentification. Veuillez vérifier vos identifiants.");
        }
      },
      error: () => {
        this.loginError = true;
        this.presentToast("Une erreur s'est produite lors de la tentative de connexion.");
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

}
