// src/app/store/reducer/auth.reducer.ts
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { User } from 'src/app/models/user';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
} from './../actions/auth.actions';

// Interface représentant l'état d'authentification
export interface AuthState {
  user: User | null;
  error: any | null;
  isLoading: boolean;
}

// État initial de l'authentification
export const initialState: AuthState = {
  user: null,
  error: null,
  isLoading: false,
};

// Le reducer est une fonction pure qui prend l'état actuel et une action, et retourne un nouvel état.
// Il est utilisé pour gérer les modifications de l'état en réponse aux actions.
export const authReducer = createReducer(
  initialState,
  on(login, (state) => {
    console.log('Reducer: login', state); // Log de l'état lors de la tentative de connexion
    return { ...state, isLoading: true, error: null };
  }),
  on(loginSuccess, (state, { user }) => {
    console.log('Reducer: loginSuccess', state, user); // Log de l'état lors de la réussite de la connexion
    return { ...state, user, isLoading: false };
  }),
  on(loginFailure, (state, { error }) => {
    console.log('Reducer: loginFailure', state, error); // Log de l'état lors de l'échec de la connexion
    return { ...state, error, isLoading: false };
  }),
  on(logout, (state) => {
    console.log('Reducer: logout', state); // Log de l'état lors de la déconnexion
    return { ...state, user: null, isLoading: false };
  })
);

// Sélecteurs pour obtenir des parties spécifiques de l'état d'authentification
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => {
    console.log('selectIsLoggedIn:', !!state.user); // Log du statut de connexion
    return !!state.user;
  }
);

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => {
    console.log('selectUser:', state.user); // Log de l'utilisateur connecté
    return state.user;
  }
);
