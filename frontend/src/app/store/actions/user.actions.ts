import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user';

// Action pour charger les informations de l'utilisateur
export const loadUser = createAction(
  '[User Page] Load User',
  props<{ id: number }>()
);

// Action déclenchée en cas de succès du chargement des informations de l'utilisateur
export const loadUserSuccess = createAction(
  '[User API] Load User Success',
  props<{ user: User }>()
);

// Action déclenchée en cas d'échec du chargement des informations de l'utilisateur
export const loadUserFailure = createAction(
  '[User API] Load User Failure',
  props<{ error: any }>()
);

// Action pour mettre à jour les informations de l'utilisateur
export const updateUser = createAction(
  '[User Page] Update User',
  props<{ user: User }>()
);

// Action déclenchée en cas de succès de la mise à jour des informations de l'utilisateur
export const updateUserSuccess = createAction(
  '[User API] Update User Success',
  props<{ user: User }>()
);

// Action déclenchée en cas d'échec de la mise à jour des informations de l'utilisateur
export const updateUserFailure = createAction(
  '[User API] Update User Failure',
  props<{ error: any }>()
);

// Action pour mettre à jour l'avatar'
export const updateUserAvatar = createAction(
  '[User] Update Avatar',
  props<{ userId: number | undefined; avatarName: string }>()
);

// Action déclenchée en cas de succès de la mise à jour de l'avatar
export const updateUserAvatarSuccess = createAction(
  '[User API] Update Avatar Success',
  props<{ user: User }>()
);

// Action déclenchée en cas d'échec de la mise à jour de l'avatar
export const updateUserAvatarFailure = createAction(
  '[User API] Update Avatar Failure',
  props<{ error: any }>()
);
