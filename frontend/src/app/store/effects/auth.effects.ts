// src/app/store/effects/auth.effects.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { logout } from '../actions/auth.actions';
import * as HearthActions from '../actions/hearths.actions';
import * as UserActions from '../actions/user.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}
  // Effet pour gérer la connexion
  // Les effets écoutent les actions et peuvent déclencher des actions supplémentaires en fonction de la logique métier.
  login$ = createEffect(() => {
    return this.actions$.pipe(
      // ofType filtre les actions pour ne réagir qu'aux actions de type 'login'
      ofType(AuthActions.login),
      switchMap((action) => {
        console.log('Effect: login', action); // Log de l'action de connexion
        // Appel du service d'authentification pour vérifier les informations de connexion
        return this.authService
          .authenticateUser(action.email, action.password)
          .pipe(
            // Si l'authentification réussit, déclenche l'action `loginSuccess` et récupère l'user pour UserStore
            concatMap((response) => {
              console.log('Effect: loginSuccess', response);
              const user = {
                id: response.user_id,
                email: response.email,
                username: response.username,
              };
              return [
                AuthActions.loginSuccess({ user, userId: response.user_id }),
                UserActions.loadUser({ id: response.user_id }),
                HearthActions.loadHearths({ userId: response.user_id }),
              ];
            }),
            // Si l'authentification échoue, déclenche l'action `loginFailure`
            catchError((error) => {
              console.log('Effect: loginFailure', error); // Log de l'erreur d'authentification
              return of(AuthActions.loginFailure({ error }));
            })
          );
      })
    );
  });

  // Effet pour gérer la déconnexion
  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.router.navigate(['/home']); // Redirige vers la page d'accueil après la déconnexion
        })
      );
    },
    { dispatch: false }
  );
}
