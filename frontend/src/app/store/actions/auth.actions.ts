// auth.actions.ts
import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user';

export const loginRequest = createAction(
  '[Login Page] Login Request',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth API] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth API] Login Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Auth Page] Logout');
