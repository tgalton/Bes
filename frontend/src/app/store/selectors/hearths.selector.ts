import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HearthsState } from '../reducers/hearths.reducer';

export const selectHearthsState =
  createFeatureSelector<HearthsState>('hearths');

export const selectAllHearths = createSelector(
  selectHearthsState,
  (state: HearthsState) => state.hearths
);

export const selectHearthsLoaded = createSelector(
  selectHearthsState,
  (state: HearthsState) => state.loaded
);
