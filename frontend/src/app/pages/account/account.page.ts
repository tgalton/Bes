import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline, pencilOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { EditAvatarComponent } from 'src/app/shared/edit-avatar/edit-avatar.component';
import * as UserActions from 'src/app/store/actions/user.actions';
import { selectUser } from 'src/app/store/selectors/auth.selector';
import {
  selectUserAvatar,
  selectUserError,
  selectUserLoading,
} from 'src/app/store/selectors/user.selector';
import { HeaderComponent } from '../../shared/header/header.component';

interface Icon {
  name: string;
  path: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule,
    HeaderComponent,
    EditAvatarComponent,
  ],
})
export class AccountPage implements OnInit {
  accountForm: FormGroup;
  user$: Observable<User | null>;
  userAvatar$: Observable<string | undefined>;
  showCurrentPassword = false;
  showNewPassword = false;
  avatarList: { name: string; path: string }[] = [];
  avatarPath: string = '';
  isLoading$ = this.store.select(selectUserLoading);
  error$ = this.store.select(selectUserError);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private http: HttpClient,
    private store: Store<AppState>,
    private modalController: ModalController
  ) {
    addIcons({ eyeOffOutline, eyeOutline, pencilOutline });
    this.accountForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
    // Récupération de l'utilisateur connecté
    this.user$ = this.store.select(selectUser);
    this.userAvatar$ = this.store.select(selectUserAvatar);
  }

  ngOnInit() {
    // Récupération de la liste d'icones d'avatars
    this.http
      .get<Icon[]>('./../../assets/icons.json')
      .subscribe((data: Icon[]) => {
        this.avatarList = data;
      });

    this.user$.subscribe((user) => {
      if (user) {
        this.accountForm.patchValue({
          username: user.username,
          email: user.email,
        });
      }
    });
  }

  updateProfile() {
    if (this.accountForm.valid) {
      const updatedUser: User = {
        ...this.accountForm.value,
        email: this.accountForm.get('email')?.value,
      };
      this.userService.updateUser(updatedUser).subscribe((user) => {
        console.log('User updated', user);
        this.store.dispatch(UserActions.updateUser({ user: updatedUser }));
        // TODO : Handle successful update
      });
    }
  }

  async openEditAvatarModal() {
    const modal = await this.modalController.create({
      component: EditAvatarComponent,
    });

    await modal.present();
  }

  // Méthode pour basculer l'état de visibilité du mot de passe actuel
  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  // Méthode pour basculer l'état de visibilité du nouveau mot de passe
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  // Méthode pour obtenir le chemin de l'avatar
  getAvatarPath(avatarName: string | undefined): string {
    const avatar = this.avatarList.find((icon) => icon.name === avatarName);
    return avatar ? avatar.path : '';
  }
}
