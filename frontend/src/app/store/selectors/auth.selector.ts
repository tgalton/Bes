import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { AuthState } from '../reducers/auth.reducer';

// Sélecteur pour obtenir l'état d'authentification à partir de l'état global de l'application
// Un sélecteur est une fonction qui extrait une partie spécifique de l'état global.
export const selectAuthState = (state: AppState) => {
  console.log('selectAuthState:', state.auth); // Log de l'état d'authentification
  return state.auth;
};

// Sélecteur pour vérifier si l'utilisateur est connecté
// Utilise le sélecteur `selectAuthState` pour obtenir l'état d'authentification,
// puis vérifie si l'utilisateur est connecté (auth.user n'est pas null).
export const isLoggedInSelector = createSelector(
  selectAuthState,
  (auth: AuthState) => {
    console.log('isLoggedInSelector:', !!auth.user); // Log du statut de connexion
    return !!auth.user;
  }
);
