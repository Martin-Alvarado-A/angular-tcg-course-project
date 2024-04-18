import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import * as AuthActions from './auth/store/auth.actions';
import { LoggingService } from './logging.service';
import * as fromApp from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'angular-tcg-course-project';

  constructor(
    private authService: AuthService,
    private logService: LoggingService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    // this.authService.autoLogin();
    this.store.dispatch(new AuthActions.AutoLogin());
    this.logService.printLog('Hello from AppComponent ngOnInit');
  }
}
