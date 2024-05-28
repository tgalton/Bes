import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/models/user';
import * as UserActions from '../actions/user.actions';

export interface UserState {
  user: User | null;
  error: any | null;
  isLoading: boolean;
}

export const initialState: UserState = {
  user: null,
  error: null,
  isLoading: false,
};

export const userReducer = createReducer(
  initialState,
  // Gestionnaire pour démarrer le chargement de l'utilisateur
  on(UserActions.loadUser, (state) => {
    console.log('Reducer: Load User', state);
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  // Gestionnaire lorsque le chargement de l'utilisateur réussit (met à jour l'utilisateur dans l'état)
  on(UserActions.loadUserSuccess, (state, { user }) => {
    console.log('Reducer: Load User Success', state, user);
    return {
      ...state,
      user,
      isLoading: false,
    };
  }),
  // Gestionnaire lorsque le chargement de l'utilisateur échoue (enregistre l'erreur dans l'état)
  on(UserActions.loadUserFailure, (state, { error }) => {
    console.log('Reducer: Load User Failure', state, error);
    return {
      ...state,
      error,
      isLoading: false,
    };
  }),
  // Gestionnaire pour démarrer la mise à jour de l'utilisateur
  on(UserActions.updateUser, (state) => {
    console.log('Reducer: Update User', state);
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  // Gestionnaire lorsque la mise à jour de l'utilisateur réussit (met à jour les infos de l'utilisateur dans l'état)
  on(UserActions.updateUserSuccess, (state, { user }) => {
    console.log('Reducer: Update User Success', state, user);
    return {
      ...state,
      user: user ? { ...state.user, ...user } : null,
      isLoading: false,
    };
  }),
  // Gestionnaire lorsque la mise à jour de l'utilisateur échoue (enregistre l'erreur dans l'état)
  on(UserActions.updateUserFailure, (state, { error }) => {
    console.log('Reducer: Update User Failure', state, error);
    return {
      ...state,
      error,
      isLoading: false,
    };
  }),

  on(UserActions.updateUserAvatarSuccess, (state, { user }) => {
    console.log('Reducer: Update User Success', state, user);
    return {
      ...state,
      user,
    };
  }),

  on(UserActions.updateUserAvatarFailure, (state, { error }) => {
    console.log('Reducer: Update User Avatar Failure', state, error);
    return {
      ...state,
      error,
    };
  })
);
