import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { User, modules } from '../user';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

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
  Plus = faPlusCircle

  courselist: boolean = true;
  isShowAdd = false;
  selectedListItem: number | null = null;
  isShowEdit = false;

  user = false;
  email: string = '';

  //course variables
  courseListData: any;
  cname: string = '';
  tname: string = '';
  moduleLength: any;
  courseData: any;
  newModule: boolean = false;
  newCreateVideo: boolean = false;
  newVideoStates: boolean[] = [];
  courseUsers:any

  ngOnInit() {
    this.http
      .get('http://localhost:8080/admin/course/getallcourses')
      .subscribe((data) => {
        this.courseListData = data;
        // console.log(this.courseListData);
        
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
    this.newModule = false;

    this.http
      .get(`http://localhost:8080/admin/course/${cname}/${tname}/getvideos`)
      .subscribe((result: any) => {
        this.cname = cname;
        this.tname = tname;
        this.courseData = result;
        this.moduleLength = this.courseData.length;

      },(error) => { 
        this.cname = cname;
        this.tname = tname;
        this.moduleLength = '0'
        this.courseData = null
      });

      //Enrolled Users API
      this.http.get(`http://localhost:8080/admin/course/getcourseusers/${cname}/${tname}`).subscribe((data)=>{
        // console.log(data);
        this.courseUsers = data
      })
  }


  editModule(moduledata: any,moduleId:string) {
    const modulename = moduledata.modulename;
    // console.log(moduledata);
    const videonames = [];
    const videolinks = [];
    for (let i = 0; moduledata[`videoname${i}`] !== undefined; i++) {
      videonames.push(moduledata[`videoname${i}`]);
      videolinks.push(moduledata[`videolink${i}`]);
    }
  
    // Create the desired format
    const requestData = {
      modulename: modulename,
      videoname: videonames,
      videolink: videolinks
    };
  
    console.log(requestData);
  
  }

newModuleData: any = {
  modulename: '',
  videoname: [''],
  videolink: ['']
};
additionalVideoname: string = '';
additionalVideolink: string = '';

  addModule() {
    this.newModule = true;
  }

  createModule(newModule:any){

    if (!Array.isArray(newModule.videoname)) {
      newModule.videoname = [newModule.videoname];
    }
  
    // Ensure videolink is an array
    if (!Array.isArray(newModule.videolink)) {
      newModule.videolink = [newModule.videolink];
    }

    newModule.videoname.push(this.additionalVideoname);
    newModule.videolink.push(this.additionalVideolink);

  
    console.log(newModule);
    
  }

  addVideo(moduleIndex: number) {
    this.newVideoStates[moduleIndex] = true;
    // this.newVideo = true;
  }

  deleteModule(cname:string,moduleId:string) {
    console.log(cname,moduleId);
    this.http.delete(`http://localhost:8080/admin/course/${cname}/${moduleId}/deletemodule`).subscribe((response)=>{console.log(response);
    },(error)=>{console.log(error);
    })
  }

  deleteVideo(moduleIndex: number) {
    this.newVideoStates[moduleIndex] = false;
  }

  createAddVideo(){
    this.newCreateVideo = true
    this.additionalVideoname = '';
    this.additionalVideolink = '';
  }
  

  removeUserAccess(email: string, cname: string, tname: string) {
    this.http
      .patch(
        `http://localhost:8080/admin/removecourseaccess/${email}/${cname}/${tname}`,null
      )
      .subscribe((data) => {
        console.log(data);
        
      });
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

  createCourse(newCourse:any) {
    // console.log(newCourse);
    this.http.post('http://localhost:8080/admin/course/addcourse',newCourse).subscribe((response)=>{response},(error)=>{console.log(error);
    })
    
    // const newCourse = { title };
    // this.list.push(newCourse);
    // alert('Course added succesfully');
    // this.searchItems = this.list;
  }

 

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
