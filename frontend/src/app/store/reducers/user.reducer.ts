import {
  createFeatureSelector,
  createReducer,
  createSelector,
} from '@ngrx/store';
import { User } from 'src/app/models/user';

export interface UserState {
  user: User | null;
}

export const initialState: UserState = {
  user: null,
};

export const userReducer = createReducer(
  initialState
  // TODO :Ajouter plus tard ici les actions à gérer
);

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);
