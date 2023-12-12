import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { User } from '../user';

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

  courselist: boolean = true;
  isShowAdd = false;
  selectedListItem: number | null = null;
  isShowEdit = false;

  user = false;
  email: string = '';

  list = [
    { title: 'Adv Java -2303 7 AM' },
    { title: 'Adv- Java 2401 9 AM' },
    { title: 'Adv-Java-2301-9 AM' },
    { title: 'Advance Java-2302-12PM' },
    { title: 'Ansible' },
    { title: 'Archived' },
    { title: 'AWS - 2302 - 10AM' },
    { title: 'AWS - 2304 7:15 AM' },
    { title: 'AWS - 2305 9 AM' },
    { title: 'AWS-2301-07 AM' },
    { title: 'AWS-2405 10:15 AM' },
    { title: 'Azure Cloud - 2301 10:15 AM' },
    { title: 'Azure Cloud - 2302 - 7PM' },
    { title: 'Azure Cloud - 2303 7 PM' },
  ];

  searchItems = this.list;

  search(search: string) {
    this.searchItems = this.list.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  selectListItem(index: number) {
    this.selectedListItem = index;
    this.courselist = true;
    this.isShowAdd = false;
  }

  listItem() {
    this.isShowEdit = true;
    this.courselist = true;
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
    const newCourse = { title };
    this.list.push(newCourse);

    alert('Course added succesfully');

    this.searchItems = this.list;
  }

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

    this.http
      .post(' http://localhost:8080/userEmail', user)
      .subscribe((response: any) => {
        if (response !== null) {
          this.table = true;
          this.userInfo = response;
        } else {
          this.table = false;
        }
      });
  }
}
