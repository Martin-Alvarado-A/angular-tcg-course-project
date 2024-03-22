import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'angular-tcg-course-project';

  constructor(
    private authService: AuthService,
    private logService: LoggingService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.logService.printLog('Hello from AppComponent ngOnInit');
  }
}
