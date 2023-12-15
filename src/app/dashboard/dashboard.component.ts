import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { course, userCourse } from '../user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  right = faArrowRight;
  camera = faVideo;
  email: string | any = localStorage.getItem('email');
  course: any;
  title: string | any = '';

  courseName: any;
  trainerName: any;

  constructor(public router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get(
        `http://localhost:8080/course/getcourseusers?courseUserName=${this.email}`
      )
      .subscribe((result: any) => {
        // console.log(result);
        this.course = result.courseslist;
        // console.log(this.course);
      });
  }

  continue(courseName: string, trainerName: string) {
    this.router.navigate(['learners'], {
      queryParams: {
        courseName: courseName,
        trainerName: trainerName,
      },
    });
  }

  // navbar functions
}
