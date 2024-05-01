import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonAvatar,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderComponent,
    ReactiveFormsModule,
  ],
})
export class AccountPage implements OnInit {
  accountForm: FormGroup;
  user: User | undefined;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private http: HttpClient
  ) {
    this.accountForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      avatar: [''], // Assuming avatar is a string of the image path
    });
  }

  ngOnInit() {
    // Récupération de la liste d'icones d'avatars
    this.http.get('path-to-your-icons.json').subscribe((data) => {
      const iconList = data;
    });

    this.authService.isLogged().subscribe((isLogged) => {
      if (isLogged) {
        const email = localStorage.getItem('userEmail'); // Assume you store the email in localStorage on login
        if (email) {
          this.user = this.userService.users.find(
            (u: User) => u.email === email
          );
          this.accountForm.patchValue({
            username: this.user?.username,
            email: this.user?.email,
            avatar: this.user?.hearths?.[0], // Assuming hearths array contains avatar paths
          });
        }
      }
    });
  }

  updateProfile() {
    if (this.accountForm.valid && this.user) {
      const updatedUser: User = {
        ...this.user,
        username: this.accountForm.value.username,
      };
      // Update avatar path if needed
      this.userService.updateUser(updatedUser).subscribe((user) => {
        console.log('User updated', user);
        // Handle successful update
      });
    }
  }
}
