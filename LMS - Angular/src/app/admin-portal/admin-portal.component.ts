import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { User, Video, modules } from '../user';
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

  constructor(
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  jwtToken:any = localStorage.getItem('jwtToken');
  headers:any = new HttpHeaders({
    'Authorization': `Bearer ${this.jwtToken}`,
    'Content-Type': 'application/json', // Adjust content type based on your API
  });

  //icons
  camera = faVideo;
  archive = faArchive;
  info = faCircleInfo;
  edit = faEdit;
  delete = faTrash;
  Plus = faPlusCircle;

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
  courseUsers: any;

  //pop-ups
  moduleDeleted = false;
  moduleUpdated = false;

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
      .subscribe(
        (result: any) => {
          // console.log(result);

          this.cname = cname;
          this.tname = tname;
          this.courseData = result;
          this.moduleLength = this.courseData.length;
        },
        (error) => {
          this.cname = cname;
          this.tname = tname;
          this.moduleLength = '0';
          this.courseData = null;
        }
      );

    //Enrolled Users API
    this.http
      .get(
        `http://localhost:8080/admin/course/getcourseusers/${cname}/${tname}`
      )
      .subscribe((data) => {
        // console.log(data);
        this.courseUsers = data;
      });
  }

  //EDIT MODULE DATA FUNCTIONS

  // editingModuleIndex: number | null = null;
  // newVideos: { videoname: string; videolink: string }[] = [];

  videosToAdd: { videoname: string; videolink: string }[] = [];

  AddNewVideo(moduleIndex: number) {
    const moduleData = this.courseData[moduleIndex];
    // Ensure that moduleData.videos is initialized as an object
    if (typeof moduleData.videos !== 'object' || moduleData.videos === null) {
      moduleData.videos = {};
    }

    // Add a new empty entry to the videos object
    const newKey = `newvideo ${Object.keys(moduleData.videos).length + 1}`;
    moduleData.videos[newKey] = ''; // Set an empty string for videoname

    // Force change detection to update the view
    this.changeDetectorRef.detectChanges();
  }

  removeNewVideo(index: number) {
    this.videosToAdd.splice(index, 1);
  }

  removeExistingVideo(moduleIndex: number, videoKey: any) {
    const moduleData = this.courseData[moduleIndex];
    // Ensure that moduleData.videos is initialized as an object
    if (typeof moduleData.videos !== 'object' || moduleData.videos === null) {
      moduleData.videos = {};
    }
    // Remove the video from the module's videos object
    delete moduleData.videos[videoKey];
  }

  editModule(moduledata: any, moduleId: string, cname: string, tname: string) {
    console.log(moduledata);

    const modulename = moduledata.modulename;
    const videonames = [];
    const videolinks = [];
    for (let i = 0; moduledata[`videoname${i}`] !== undefined; i++) {
      videonames.push(moduledata[`videoname${i}`]);
      videolinks.push(moduledata[`videolink${i}`]);
    }

    const requestData = {
      modulename: modulename,
      videoname: videonames,
      links: videolinks,
    };

    // API CALL
    console.log(requestData);

    // Add your HTTP call to update the data here
    // this.http
    //   .put(
    //     `http://localhost:8080/admin/course/${cname}/${moduleId}/updatemodules`,
    //     requestData
    //   )
    //   .subscribe((result) => {
    //     console.log(result);

    //     this.moduleUpdated = true;

    //     setTimeout(() => {
    //       this.moduleUpdated = false;
    //     }, 5000);
    //     window.location.reload();
    //   });
  }

  // editModule(moduledata: any, moduleId: string, cname: string, tname: string) {
  //   console.log(moduledata);

  //   const modulename = moduledata.modulename;
  //   // console.log(moduledata);
  //   const videonames = [];
  //   const videolinks = [];
  //   for (let i = 0; moduledata[`videoname${i}`] !== undefined; i++) {
  //     videonames.push(moduledata[`videoname${i}`]);
  //     videolinks.push(moduledata[`videolink${i}`]);
  //   }
  //   const requestData = {
  //     modulename: modulename,
  //     videoname: videonames,
  //     links: videolinks
  //   };
  // // API CALL
  // console.log(requestData);
  //   // this.http.put(`http://localhost:8080/admin/course/${cname}/${moduleId}/updatemodules`,requestData)
  //   // .subscribe((result)=>{
  //   //   // console.log(result);

  //   // })
  // }

  addVideo(j: number) {
    this.newVideoStates[j] = true;
  }

  // ADD MODULE FUNCTIONS

  //to convert form data according to backend input data
  newModuleData: any = {
    modulename: '',
    modulenumber: 0,
    videos: [{ videoname: '', videolink: '' }],
  };

  addModule() {
    this.newModule = true;
  }

  createModule(newModuleData: any, cname: string, tname: string) {
    // console.log(newModuleData);
    newModuleData.videos = newModuleData.videos || [];
    // Filter out empty videos
    newModuleData.videos = newModuleData.videos.filter(
      (video: any) =>
        video.videoname.trim() !== '' || video.videolink.trim() !== ''
    );

    const formattedData = {
      courseName: cname,
      trainerName: tname,
      modulename: newModuleData.modulename,
      modulenumber: newModuleData.modulenumber,
      videoname: newModuleData.videos.map((video: any) => video.videoname),
      videolink: newModuleData.videos.map((video: any) => video.videolink),
    };

    console.log(formattedData);

    this.http
      .post('http://localhost:8080/admin/course/savevideo', formattedData)
      .subscribe((result) => {
        console.log(result);
      });
  }

  createAddVideo() {
    this.newModuleData.videos.push({ videoname: '', videolink: '' });
    this.newCreateVideo = true;
  }

  removeVideo(index: number) {
    this.newModuleData.videos.splice(index, 1);
  }

  deleteModule(cname: string, moduleId: string) {
    console.log(cname, moduleId);
    this.http
      .delete(
        `http://localhost:8080/admin/course/${cname}/${moduleId}/deletemodule`
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.moduleDeleted = true;

          setTimeout(() => {
            this.moduleDeleted = false;
          }, 5000);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  removeUserAccess(email: string, cname: string, tname: string) {
    this.http
      .patch(
        `http://localhost:8080/admin/removecourseaccess/${email}/${cname}/${tname}`,
        { headers: this.headers }
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

  createCourse(newCourse: any) {
    // console.log(newCourse);
    this.http
      .post('http://localhost:8080/admin/course/addcourse', newCourse)
      .subscribe(
        (response) => {
          response;
        },
        (error) => {
          console.log(error);
        }
      );

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
