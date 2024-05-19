// src/app/store/effects/auth.effects.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { logout } from '../actions/auth.actions'; // Assurez-vous que le chemin est correct

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
            // Si l'authentification réussit, déclenche l'action `loginSuccess`
            map((user) => {
              console.log('Effect: loginSuccess', user); // Log de l'utilisateur authentifié
              return AuthActions.loginSuccess({ user });
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
