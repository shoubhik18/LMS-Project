import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { User, login } from './user';

import { Router } from '@angular/router';
import { EmailService } from './email.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  capitalizedEmail: string = '';
  // status: string = '';

  status = new EventEmitter<boolean>(false);
  roleName: string = '';
  userName: string = '';
  email: string = '';
  userId: string = '';
  jwt: string = '';
  image: string = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private emailService: EmailService
  ) {}

  Login(loginData: login) {
    this.http
      .post('http://localhost:8080/auth/login', loginData)
      .subscribe((result: User | any) => {
        if (result != null) {
          console.log(result.role);
          this.roleName = result.role;
          this.status.emit(false);
          if (this.roleName === 'admin') {
            this.roleName = 'admin';
            this.email = loginData.userEmail;
            this.userId = result.id;
            this.userName = result.username;
            localStorage.setItem('email', this.email);
            localStorage.setItem('role', this.roleName);
            localStorage.setItem('userId', this.userId);
            localStorage.setItem('username', this.userName);

            this.router.navigate(['dashboard']);
          } else if (this.roleName === 'user') {
            this.roleName = 'user';
            this.email = loginData.userEmail;
            this.userId = result.id;
            this.userName = result.username;
            localStorage.setItem('email', this.email);
            localStorage.setItem('role', this.roleName);
            localStorage.setItem('userId', this.userId);
            localStorage.setItem('username', this.userName);

            this.router.navigate(['dashboard']);
          }

          this.capitalizedEmail = loginData.userEmail.slice(0, 2).toUpperCase();
          localStorage.setItem('capitalizedEmail', this.capitalizedEmail);

          //         // console.log(this.capitalizedEmail);
          this.emailService.setEmailData(this.capitalizedEmail);
        } else {
          this.status.emit(true);
        }
      });
  }

  // Login(loginData: login) {
  //   this.http
  //     .post('http://localhost:8080/login', loginData)
  //     .subscribe((result: User | any) => {
  //       if (result != null) {
  //         console.log(result.role);
  //         this.roleName = result.role;
  //         this.status.emit(false);
  //         if (this.roleName === 'admin') {
  //           this.email = loginData.email;
  //           this.roleName = 'admin';
  //           this.userId = result.id;
  //           this.userName = result.username;
  //           localStorage.setItem('email', this.email);
  //           localStorage.setItem('role', this.roleName);
  //           localStorage.setItem('userId', this.userId);
  //           localStorage.setItem('username', this.userName);

  //           this.router.navigate(['dashboard']);
  //         } else if (this.roleName === 'user') {
  //           this.roleName = 'user';
  //           this.userId = result.id;
  //           this.email = loginData.email;
  //           this.userName = result.username;
  //           localStorage.setItem('email', this.email);
  //           localStorage.setItem('role', this.roleName);
  //           localStorage.setItem('userId', this.userId);
  //           localStorage.setItem('username', this.userName);

  //           this.router.navigate(['dashboard']);
  //         }

  //         this.capitalizedEmail = loginData.email.slice(0, 2).toUpperCase();
  //         localStorage.setItem('capitalizedEmail', this.capitalizedEmail);

  //         //         // console.log(this.capitalizedEmail);
  //         this.emailService.setEmailData(this.capitalizedEmail);
  //       } else {
  //         this.status.emit(true);
  //       }
  //     });
  // }
}
