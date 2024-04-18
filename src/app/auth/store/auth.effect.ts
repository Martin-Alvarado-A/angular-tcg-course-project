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

@Injectable()
export class AuthEffects {
  private API_KEY = this.SS.API_KEY;
  private Auth_URL = `https://identitytoolkit.googleapis.com/v1/accounts`;

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
              map((resData) => {
                const expirationDate = new Date(
                  new Date().getTime() + +resData.expiresIn * 1000
                );
                return new AuthActions.Login({
                  email: resData.email,
                  userId: resData.localId,
                  token: resData.idToken,
                  expirationDate: expirationDate,
                });
              }),
              catchError((errorRes) => {
                console.error(
                  `🔎 | AuthEffects | authLogin > errorRes:`,
                  errorRes
                );
                let errorMsg = 'An unknown error occurred!';

                if (!errorRes.error || !errorRes.error.error) {
                  return of(new AuthActions.LoginFail(errorMsg));
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

                return of(new AuthActions.LoginFail(errorMsg));
              })
            );
        })
      ),
    { dispatch: true }
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN),
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
