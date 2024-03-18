import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    console.log(`🔎 | AuthComponent | onSubmit > form:`, form.value);
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      //
    } else {
      this.authService.signup(email, password).subscribe(
        (resData) => {
          console.log(`🔎 | AuthComponent | onSubmit > resData:`, resData);
        },
        (error) => {
          console.log(`🔎 | AuthComponent | onSubmit > error:`, error);
        }
      );
    }

    form.reset();
  }
}