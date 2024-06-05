import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline, pencilOutline } from 'ionicons/icons';
import {
  EMPTY,
  Observable,
  catchError,
  first,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AppState } from 'src/app/app.state';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { EditAvatarComponent } from 'src/app/shared/edit-avatar/edit-avatar.component';
import * as AuthActions from 'src/app/store/actions/auth.actions';
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
    HeaderComponent,
    EditAvatarComponent,
  ],
  // providers: [provideHttpClient(withInterceptorsFromDi())]
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
    private authService: AuthService,
    private http: HttpClient,
    private store: Store<AppState>,
    private modalController: ModalController,
    private actions$: Actions,
    private toastController: ToastController,
    protected avatarService: AvatarService
  ) {
    addIcons({ eyeOffOutline, eyeOutline, pencilOutline });
    // Validators
    this.accountForm = this.fb.group(
      {
        username: ['', Validators.minLength(3)],
        email: [
          { value: '', disabled: true },
          [Validators.required, Validators.email],
        ],
        currentPassword: [''],
        newPassword: ['', [Validators.minLength(8)]], // Minimum 8 caractères pour newPassword
      },
      { validators: this.accountValidator() }
    );

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

  accountValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const username = control.get('username')?.value;
      const currentPassword = control.get('currentPassword')?.value;
      const newPassword = control.get('newPassword')?.value;

      // Vérifie si newPassword n'est pas vide alors currentPassword est requis
      if (newPassword && !currentPassword) {
        return { currentPasswordRequired: true };
      }

      // Vérifie qu'au moins un des champs newPassword ou username est renseigné
      if (!newPassword && !username) {
        return { oneFieldRequired: true };
      }

      return null;
    };
  }

  updateProfile() {
    // Récupération des valeurs du formulaire
    const email = this.accountForm.get('email')?.value;
    const currentPassword = this.accountForm.get('currentPassword')?.value;
    const newPassword = this.accountForm.get('newPassword')?.value;
    const username = this.accountForm.get('username')?.value;

    // Observable représentant le profil utilisateur
    const userProfil$ = this.user$;

    userProfil$
      .pipe(
        // first() émet uniquement la première valeur émise par l'Observable et complète
        first(),
        // switchMap transforme les émissions d'un Observable en un nouvel Observable
        switchMap((userProfil) => {
          if (userProfil) {
            // Créer une nouvelle instance de l'objet utilisateur avec le username mis à jour
            const updatedUserProfil = { ...userProfil, username: username };

            if (newPassword) {
              // Dispatcher l'action de login
              this.store.dispatch(
                AuthActions.login({ email, password: currentPassword })
              );
              // On s'abonne à loginFailure, s'il advient on affiche l'erreur
              this.actions$
                .pipe(
                  ofType(AuthActions.loginFailure),
                  tap(() => {
                    this.presentToast('Mot de passe actuel erroné.');
                  })
                )
                .subscribe();
              // Attendre le succès du login avant de continuer
              return this.actions$.pipe(
                // ofType filtre les actions pour ne laisser passer que celles de type loginSuccess
                ofType(AuthActions.loginSuccess),
                // take(1) prend uniquement la première occurrence et complète
                take(1),
                // tap effectue une action secondaire (effet de bord) sans modifier les données
                tap(() => {
                  // Créer une nouvelle instance de l'objet utilisateur avec le mot de passe mis à jour
                  updatedUserProfil.password = newPassword;
                }),
                // map transforme les données émises par l'Observable
                map(() => updatedUserProfil)
              );
            } else {
              // Si pas de changement de mot de passe, continuer directement avec updatedUserProfil
              return of(updatedUserProfil);
            }
          } else {
            // Si userProfil est nul, retourner un Observable vide pour compléter le flux
            return EMPTY;
          }
        }),
        // tap pour dispatcher l'action de mise à jour de l'utilisateur
        tap((updatedUserProfil) => {
          if (updatedUserProfil) {
            this.store.dispatch(
              UserActions.updateUser({ user: updatedUserProfil })
            );
          }
        }),
        // catchError pour capturer et gérer les erreurs
        catchError((error) => {
          console.error('Erreur lors de la mise à jour du profil:', error);
          // Retourner un Observable vide en cas d'erreur pour compléter le flux
          return EMPTY;
        })
        // subscribe pour exécuter le flux d'Observable
      )
      .subscribe();
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
