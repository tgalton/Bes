import { AuthState } from './store/reducers/auth.reducer';
import { HearthsState } from './store/reducers/hearths.reducer';
import { UserState } from './store/reducers/user.reducer';

export interface AppState {
  auth: AuthState;
  userState: UserState;
  hearthsState: HearthsState;
}
