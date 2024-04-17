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
  console.log(`🔎 | authReducer | state:`, state);
  switch (action.type) {
    case AuthActions.LOGIN:
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
      return { ...state, autherror: null, loading: true };

    case AuthActions.LOGIN_FAIL:
      return {
        ...state,
        user: null,
        autherror: action.payload,
        loading: false,
      };

    default:
      return state;
  }
}
