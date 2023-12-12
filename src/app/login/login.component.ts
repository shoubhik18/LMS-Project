import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { User } from '../user';
import { HttpClient } from '@angular/common/http';
import { EmailService } from '../email.service';
import { AuthService } from '../auth.service';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  status: string = '';
  warning: string = '';
  // role: string = 'user';
  // capitalizedEmail: string = '';

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
    if (this.protector === false) {
      this.protector = true;
    } else {
      this.protector = false;
    }
  }

  home() {}

  login(loginData: User) {
    if (loginData.email.startsWith('@')) {
      this.status = 'login Failed';
      this.warning = 'email cannot start with an address';
    } else {
      this.auth.Login(loginData);
      this.auth.status.subscribe((result) => {
        if (result) {
          this.status = 'login Failed';
          this.warning = 'Invalid Details!';
        } else {
          this.status = '';
        }
      });
    }
    // const loginData = { email: this.email, password: this.password };
    // this.http
    //   .post('http://localhost:8080/login', loginData, { responseType: 'text' })
    //   .subscribe((response: string) => {
    //     if (response === 'login successfully') {
    //       if (loginData.email.endsWith('@gmail.com')) {
    //         this.role = 'user';
    //         console.log(this.role);
    //         this.router.navigate(['home']);
    //       } else if (this.email.endsWith('@digital-edify.com')) {
    //         this.role = 'admin';
    //         console.log(this.role);
    //         this.router.navigate(['dashboard']);
    //       }
    //     this.capitalizedEmail = this.email.slice(0, 2).toUpperCase();
    //     // localStorage.setItem('capitalizedEmail', this.capitalizedEmail);
    //     // console.log(this.capitalizedEmail);
    //     this.emailService.setEmailData(this.capitalizedEmail);
    //   } else {
    //     // window.alert('Invalid details');
    //     this.status = 'login Failed';
    //   }
    // });
  }
}
