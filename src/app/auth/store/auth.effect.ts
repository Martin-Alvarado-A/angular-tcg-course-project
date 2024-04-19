import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { sercretService } from '../../shared/sercrets.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
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

  const user = new User(
    resData.email,
    resData.localId,
    resData.idToken,
    expirationDate
  );
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthSuccess({
    email: resData.email,
    userId: resData.localId,
    token: resData.idToken,
    expirationDate: expirationDate,
    redirect: true,
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
              tap((resData) => {
                this.authService.setLogoutTimer(+resData.expiresIn * 1000);
              }),
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
              tap((resData) => {
                this.authService.setLogoutTimer(+resData.expiresIn * 1000);
              }),
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
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthSuccess) => {
          if (authSuccessAction.payload.redirect) {
            this.router.navigate(['/']);
          }
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
          const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
          } = JSON.parse(localStorage.getItem('userData'));
          if (!userData) return { type: 'Fail' };

          const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
          );

          if (loadedUser.token) {
            const expirationDuration =
              new Date(userData._tokenExpirationDate).getTime() -
              new Date().getTime();

            this.authService.setLogoutTimer(expirationDuration);

            return new AuthActions.AuthSuccess({
              email: loadedUser.email,
              userId: loadedUser.id,
              token: loadedUser.token,
              expirationDate: new Date(userData._tokenExpirationDate),
              redirect: false,
            });
          }
          return { type: 'Fail' };
        })
      ),
    { dispatch: true }
  );

  authLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private SS: sercretService,
    private router: Router,
    private authService: AuthService
  ) {}
}
