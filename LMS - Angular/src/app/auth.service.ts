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
errorMessage:any

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
    // console.log(loginData);

    this.http
      .post('http://localhost:8080/auth/login', loginData)
      .subscribe((result: User | any) => {
        if (result != null) {
          console.log(result);
          this.roleName = result.userRole;
          this.status.emit(false);
          if (this.roleName === 'admin') {
            this.roleName = 'admin';
            this.email = loginData.userEmail;
            this.userId = result.userId;
            this.userName = result.userName;
            this.jwt = result.jwtToken;
            this.image = result.userImage;

            localStorage.setItem('email', this.email);
            localStorage.setItem('role', this.roleName);
            localStorage.setItem('userId', this.userId);
            localStorage.setItem('username', this.userName);
            localStorage.setItem('jwtToken', this.jwt);
            localStorage.setItem('image', this.image);

            this.router.navigate(['dashboard']);
          } else if (this.roleName === 'user') {
            this.roleName = 'user';
            this.email = loginData.userEmail;
            this.userId = result.userId;
            this.userName = result.userName;
            this.jwt = result.jwtToken;
            this.image = result.userImage;

            localStorage.setItem('email', this.email);
            localStorage.setItem('role', this.roleName);
            localStorage.setItem('userId', this.userId);
            localStorage.setItem('username', this.userName);
            localStorage.setItem('jwtToken', this.jwt);
            localStorage.setItem('image', this.image);

            this.router.navigate(['dashboard']);
          }

          this.capitalizedEmail = loginData.userEmail.slice(0, 2).toUpperCase();
          localStorage.setItem('capitalizedEmail', this.capitalizedEmail);

          //         // console.log(this.capitalizedEmail);
          this.emailService.setEmailData(this.capitalizedEmail);
        } else {
          // console.log(result);

          this.status.emit(true);
        }
      },
      (error) => { 
        
        this.errorMessage = error.error.errorMessage
        this.status.emit(true);
        console.log(this.errorMessage)
      });
  }
}
