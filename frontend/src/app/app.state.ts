import { AuthState } from './store/reducers/auth.reducer'; // Vérifiez le chemin
import { UserState } from './store/reducers/user.reducer';

export interface AppState {
  auth: AuthState;
  userState: UserState;
}
