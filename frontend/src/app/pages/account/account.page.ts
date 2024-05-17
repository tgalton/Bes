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
import { Store, select } from '@ngrx/store';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { selectUser } from 'src/app/store/reducers/user.reducer';
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
  user: User | null | undefined;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private http: HttpClient,
    private store: Store // Inject the Store here
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
        // Si l'utilisateur est connecté, récupère les informations de l'utilisateur via le store
        this.store.pipe(select(selectUser)).subscribe((user) => {
          if (user !== null) {
            this.user = user;
            console.log(user);
            // this.accountForm.patchValue(this.user);
          }
        });
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
