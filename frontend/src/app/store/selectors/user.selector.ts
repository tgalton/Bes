import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../reducers/user.reducer';

// Sélecteur pour obtenir l'état utilisateur
export const selectUserState = createFeatureSelector<UserState>('user');

// Sélecteur pour obtenir les informations de l'utilisateur
export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);

// Sélecteur pour obtenir l'état de chargement
export const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.isLoading
);

// Sélecteur pour obtenir les erreurs
export const selectUserError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);

export const selectUserAvatar = createSelector(
  selectUserState,
  (state: UserState) => {
    console.log('testAvatarSelector :' + state.user?.avatar);
    return state.user?.avatar;
  }
);

// Sélecteur pour l'erreur spécifique de l'avatar
export const selectUserAvatarError = createSelector(
  selectUserState,
  (state: UserState) => (state.error ? state.error.avatar : null)
);
