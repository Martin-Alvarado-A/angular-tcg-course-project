import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
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
                return of(
                  new AuthActions.Login({
                    email: resData.email,
                    userId: resData.localId,
                    token: resData.idToken,
                    expirationDate: expirationDate,
                  })
                );
              }),
              catchError((error) => {
                return of();
              })
            );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private SS: sercretService
  ) {}
}

//     authLogin = createEffect(() => this.actions$.pipe(...));
