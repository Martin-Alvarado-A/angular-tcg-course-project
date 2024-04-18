import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { sercretService } from '../../shared/sercrets.service';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (resData) => {
  const expirationDate = new Date(
    new Date().getTime() + +resData.expiresIn * 1000
  );
  return new AuthActions.AuthSuccess({
    email: resData.email,
    userId: resData.localId,
    token: resData.idToken,
    expirationDate: expirationDate,
  });
};

const handleError = (errorRes) => {
  console.error(`🔎 | AuthEffects | authLogin > errorRes:`, errorRes);
  let errorMsg = 'An unknown error occurred!';

  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthFail(errorMsg));
  }

  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMsg = 'The email already exists.';
      break;
    case 'EMAIL_NOT_FOUND': // Deprecated?
      errorMsg = 'The email does not exist.';
      break;
    case 'INVALID_PASSWORD': // Deprecated?
      errorMsg = 'The password is not correct.';
      break;
    case 'INVALID_LOGIN_CREDENTIALS':
      errorMsg = 'The login credentials are invalid.';
      break;

    default:
      break;
  }

  return of(new AuthActions.AuthFail(errorMsg));
};

@Injectable()
export class AuthEffects {
  private API_KEY = this.SS.API_KEY;
  private Auth_URL = `https://identitytoolkit.googleapis.com/v1/accounts`;

  authSignup = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
          const body = {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true,
          };

          return this.http
            .post<AuthResponseData>(
              `${this.Auth_URL}:signUp?key=${this.API_KEY}`,
              body
            )
            .pipe(
              map((resData) => handleAuthentication(resData)),
              catchError((errorRes) => handleError(errorRes))
            );
        })
      ),
    {
      dispatch: true,
    }
  );

  authLogin = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
          const body = {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          };

          return this.http
            .post<AuthResponseData>(
              `${this.Auth_URL}:signInWithPassword?key=${this.API_KEY}`,
              body
            )
            .pipe(
              map((resData) => handleAuthentication(resData)),
              catchError((errorRes) => handleError(errorRes))
            );
        })
      ),
    { dispatch: true }
  );

  authRedirect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private SS: sercretService,
    private router: Router
  ) {}
}
