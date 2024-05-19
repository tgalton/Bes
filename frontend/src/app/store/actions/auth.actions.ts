// src/app/store/actions/auth.actions.ts
import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user';

// Les actions sont des objets qui décrivent une intention de changement de l'état.
// Elles contiennent un type et des données supplémentaires nécessaires pour effectuer ce changement.

// Action pour initier la connexion
export const login = createAction(
  '[Auth Page] Login',
  props<{ email: string; password: string }>()
);

// Action pour signaler une connexion réussie
export const loginSuccess = createAction(
  '[Auth API] Login Success',
  props<{ user: User }>()
);

// Action pour signaler un échec de connexion
export const loginFailure = createAction(
  '[Auth API] Login Failure',
  props<{ error: any }>()
);

// Action pour initier la déconnexion
export const logout = createAction('[Auth Page] Logout');
