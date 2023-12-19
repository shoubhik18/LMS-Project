import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { User } from '../user';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css'],
})
export class AdminPortalComponent {
  userInfo: User[] | any;
  table: boolean = false;
  find: boolean = false;

  constructor(private http: HttpClient) {}

  //icons
  camera = faVideo;
  archive = faArchive;
  info = faCircleInfo;
  edit = faEdit;
  delete = faTrash;

  courselist: boolean = true;
  isShowAdd = false;
  selectedListItem: number | null = null;
  isShowEdit = false;

  user = false;
  email: string = '';

  //course variables
  courseData: any;
  cname: string = '';
  tname: string = '';
  moduleLength: any;
  enrolledUsers: any;
  newModule: boolean = false;
  newVideo: boolean = false;

  ngOnInit() {
    this.http
      .get('http://localhost:8080/admin/getallcourses')
      .subscribe((data) => {
        this.courseData = data;
      });
  }

  // searchItems = this.list;

  search(search: string) {
    // this.searchItems = this.list.filter((item) =>
    //   item.title.toLowerCase().includes(search.toLowerCase())
    // );
  }

  selectListItem(index: number) {
    this.selectedListItem = index;
    this.courselist = true;
    this.isShowAdd = false;
  }

  listItem(cname: string, tname: string) {
    this.isShowEdit = true;
    this.courselist = true;

    this.http
      .get(
        `http://localhost:8080/course/getcourse?courseName=${cname}&trainerName=${tname}`
      )
      .subscribe((result: any) => {
        this.cname = cname;
        this.tname = tname;
        this.enrolledUsers = result;
        // console.log(this.enrolledUsers);
      });
  }

  removeUserAccess(email: string, cname: string, tname: string) {
    // this.http
    //   .delete(
    //     `http://localhost:8080/admin/removecourseaccess?userEmail=${email}&courseName=${cname}&trainerName=${tname}`
    //   )
    //   .subscribe((data) => {});
  }

  add() {
    this.courselist = true;
    this.isShowAdd = true;
    this.isShowEdit = false;
    this.selectedListItem = null;
    this.user = false;
  }

  tabStates: { [key: string]: boolean } = {
    courseInfo: true,
    modules: false,
    resources: false,
    projects: false,
    enrolled: false,
    resume: false,
  };

  style(tab: string) {
    return {
      color: this.tabStates[tab] ? 'black' : '#8f949b',
      'border-bottom': this.tabStates[tab]
        ? '2px solid #1f2937'
        : '2px #8f949b solid',
    };
  }

  active(tab: string) {
    Object.keys(this.tabStates).forEach((key) => (this.tabStates[key] = false));
    this.tabStates[tab] = true;
  }

  course() {
    if (this.courselist === false) {
      this.courselist = true;
    }
    this.user = false;
  }

  createCourse(title: string) {
    // const newCourse = { title };
    // this.list.push(newCourse);
    // alert('Course added succesfully');
    // this.searchItems = this.list;
  }

  addModule() {
    this.newModule = true;
  }

  addVideo() {
    this.newVideo = true;
  }

  deleteModule() {}

  // User functions

  users() {
    this.user = true;
    this.courselist = false;
    this.isShowAdd = false;
    this.isShowEdit = false;
  }

  sampleUsers() {
    this.http.get(' http://localhost:8080/sample-file').subscribe();
  }

  userFind(user: string) {
    this.find = true;

    // this.http
    //   .post(' http://localhost:8080/userEmail', user)
    //   .subscribe((response: any) => {
    //     if (response !== null) {
    //       this.table = true;
    //       this.userInfo = response;
    //     } else {
    //       this.table = false;
    //     }
    //   });
  }
}
