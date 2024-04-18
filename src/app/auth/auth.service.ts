import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../auth/store/auth.actions';
import { sercretService } from '../shared/sercrets.service';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private SS: sercretService,
    private store: Store<fromApp.AppState>
  ) {}

  private tokenExpirationTimer: any;

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
