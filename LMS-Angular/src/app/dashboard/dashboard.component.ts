import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../service-floder/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {

  baseUrl: any = this.auth.getBaseUrl();

  right = faArrowRight;
  camera = faVideo;
  email: string | any = localStorage.getItem('email');
  course: any;
  title: string | any = '';

  courseName: any;
  trainerName: any;

  constructor(public router: Router, private http: HttpClient,private auth: AuthService) {}

  ngOnInit(): void {
    this.http
      .get(`${this.baseUrl}/admin/course/getcourseuserinfo/${this.email}`)
      .subscribe((result: any) => {
        this.course = result.coursesList;
      });
  }

  //sending coursename and trainernaame to learners-dashboard for using for api calls ...  
  continue(courseName: string, courseTrainer: string) {
    this.router.navigate(['learners'], {
      queryParams: {
        courseName: courseName,
        courseTrainer: courseTrainer,
      },
    });
  }
}
