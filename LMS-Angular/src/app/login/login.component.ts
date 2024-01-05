import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { login } from '../user';
import { HttpClient } from '@angular/common/http';
import { EmailService } from '../service-floder/email.service';
import { AuthService } from '../service-floder/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userEmail: string = '';
  password: string = '';
  status: string = '';
  warning: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private emailService: EmailService,
    private auth: AuthService
  ) {}

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  protector = false;

  forgotPwd() {
    this.router.navigate(['forgot-password']);
  }

  eye() {
   this.protector = !this.protector
  }

  login(loginData: login) {
    if (loginData.userEmail.startsWith('@')) {
      this.status = 'login Failed';
      this.warning = 'Email cannot start with an address';
    console.log(loginData);

    } else {
    this.auth.Login(loginData);
    this.auth.status.subscribe((result) => {
      if (result) {
        this.status = 'login Failed';
        this.warning = this.auth.errorMessage;
      } else {
        this.status = '';
      }
    });
    }
  }
}
