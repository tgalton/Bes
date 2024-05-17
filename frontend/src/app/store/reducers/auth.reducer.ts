// auth.reducer.ts
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { User } from 'src/app/models/user';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  user: User | null;
  error: any | null;
  isLoading: boolean;
}

export const initialState: AuthState = {
  user: null,
  error: null,
  isLoading: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginRequest, (state, { email, password }) => {
    console.log('Login Request Action:', email);
    return { ...state, isLoading: true, error: null };
  }),
  on(AuthActions.loginSuccess, (state, { user }) => {
    console.log('Login Success Action:', user);
    return { ...state, user, isLoading: false };
  }),
  on(AuthActions.loginFailure, (state, { error }) => {
    console.log('Login Failure Action:', error);
    return { ...state, error, isLoading: false };
  }),
  on(AuthActions.logout, (state) => {
    console.log('Logout Action');
    return { ...state, user: null };
  })
);

// Selectors
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => !!state.user
);

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);
