import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import * as UserActions from '../actions/user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  // Effect to load user information
  loadUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap((action) => {
        console.log('Effect: Load User', action);
        return this.userService.getUser(action.id).pipe(
          map((user) => {
            console.log('Effect: Load User Success', user);
            return UserActions.loadUserSuccess({ user });
          }),
          catchError((error) => {
            console.log('Effect: Load User Failure', error);
            return of(UserActions.loadUserFailure({ error }));
          })
        );
      })
    );
  });

  // Effect to update user information
  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap((action) => {
        console.log('Effect: Update User', action);
        return this.userService.updateUser(action.user).pipe(
          map((user) => {
            console.log('Effect: Update User Success', user);
            return UserActions.updateUserSuccess({ user });
          }),
          catchError((error) => {
            console.log('Effect: Update User Failure', error);
            return of(UserActions.updateUserFailure({ error }));
          })
        );
      })
    );
  });

  // Effect to change the user's avatar
  updateUserAvatar$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateUserAvatar),
      switchMap((action) => {
        console.log('1. Effect: Start Update Avatar', action);
        return this.userService.updateUserAvatar(action.avatarName).pipe(
          map((user) => {
            console.log('2. Effect: Update Avatar Success', user);
            return UserActions.updateUserAvatarSuccess({ user });
          }),
          catchError((error) => {
            console.log('3. Effect: Update Avatar Failure', error);
            return of(UserActions.updateUserAvatarFailure({ error }));
          })
        );
      })
    );
  });
}
