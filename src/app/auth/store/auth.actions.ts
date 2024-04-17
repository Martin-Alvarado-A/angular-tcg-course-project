import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] LOGIN_START';
export const LOGIN = '[Auth] LOGIN';
export const LOGOUT = '[Auth] LOGOUT';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;

  constructor() {}
}

export type AuthActionsType = Login | Logout;
