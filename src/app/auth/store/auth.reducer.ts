import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActionsType
) {
  console.log(`🔎 | authReducer | ${action.type} state:`, state);
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const payload = action.payload;
      const user = new User(
        payload.email,
        payload.userId,
        payload.token,
        payload.expirationDate
      );
      return { ...state, user: user, authError: null, loading: false };

    case AuthActions.LOGOUT:
      return { ...state, user: null };

    case AuthActions.LOGIN_START:
      return { ...state, authError: null, loading: true };

    case AuthActions.AUTHENTICATE_FAILURE:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };

    default:
      return state;
  }
}
