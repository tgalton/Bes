// auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs'; // Separated import of 'of' from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'; // Imported operators from 'rxjs/operators'
import { AuthService } from 'src/app/services/auth.service';
import * as AuthActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      switchMap((action) =>
        this.authService.authenticateUser(action.email, action.password).pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    );
  });
  constructor(private actions$: Actions, private authService: AuthService) {}
}
