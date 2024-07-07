import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HearthsState } from '../reducers/hearths.reducer';

export const selectHearthsState =
  createFeatureSelector<HearthsState>('hearths');

// Sélecteur pour obtenir tous les foyers
export const selectAllHearths = createSelector(
  selectHearthsState,
  (state: HearthsState) => state.hearths
);

export const selectIfHearthsLoaded = createSelector(
  selectHearthsState,
  (state: HearthsState) => state.loaded
);

export const selectHearthsLoaded = createSelector(
  selectHearthsState,
  (state: HearthsState) => state.hearths
);

// Selecteur pour obtenir les utilisateurs des foyers avec leurs avatars
export const selectHearthUsers = createSelector(selectAllHearths, (hearths) =>
  hearths.map((hearth) => hearth.hearthUsers).flat()
);
