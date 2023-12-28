import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { User, Video, modules } from '../user';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth.service';

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
    private changeDetectorRef: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  baseUrl: any = this.auth.getBaseUrl();
  jwtToken: any = localStorage.getItem('jwtToken');

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
  searchItems: any;
  courseEdit: boolean = false;

  user = false;
  email: string = '';

  //course variables
  courseListData: any;
  cname: string = '';
  tname: string = '';
  oldcname: string = '';
  oldtname: string = '';
  description: string = '';
  moduleLength: any;
  courseData: any;
  newModule: boolean = false;
  newCreateVideo: boolean = false;
  newVideoStates: boolean[] = [];
  courseUsers: any;

  //pop-ups
  popup = false;
  message = '';

  ngOnInit() {
    this.http
      .get(`${this.baseUrl}/admin/course/getallcourses`)
      .subscribe((data) => {
        this.courseListData = data;
        this.searchItems = this.courseListData;
        // console.log(this.courseListData);
      });
    // console.log(this.jwtToken);
    // console.log(this.headers);
  }

  // search functions

  search(search: string) {
    this.searchItems = this.courseListData.filter(
      (item: { courseName: string }) =>
        item.courseName.toLowerCase().includes(search.toLowerCase())
    );
  }

  selectListItem(index: number) {
    this.selectedListItem = index;
    this.courselist = true;
    this.isShowAdd = false;
    this.courseEdit = false;
  }

  editCourse() {
    this.isShowEdit = false;
    this.courselist = true;
    this.courseEdit = true;
    this.oldcname = this.cname;
    this.oldtname = this.tname;
  }

  // create/edit course api
  selectedFile: File | null = null;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  createCourse(newCourse: any) {
    console.log(newCourse);
    let formData: FormData = new FormData();
    formData.append('courseName', newCourse.courseName);
    formData.append('courseTrainer', newCourse.courseTrainer);
    formData.append('description', newCourse.description);

    this.http
      .post(`${this.baseUrl}/admin/course/addcourse`, formData)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  editExistingCourse(course: any) {
    console.log(course.courseName);
    console.log('cname:', this.oldcname, 'tname:', this.oldtname);

    let formData: FormData = new FormData();
    formData.append('courseName', course.courseName);
    formData.append('courseTrainer', course.courseTrainer);
    formData.append('description', course.description);

    if (this.selectedFile) {
      formData.append('courseImage', this.selectedFile);
    }

    this.http
      .put(
        `${this.baseUrl}/admin/course/updatecourse/${this.oldcname}/${this.oldtname}`,
        formData
      )
      .subscribe((result) => {
        console.log(result);
      });

    this.oldcname = '';
    this.oldtname = '';
  }

  listItem(cname: string, tname: string) {
    this.isShowEdit = true;
    this.courselist = true;
    this.newModule = false;

    this.http
      .get(`${this.baseUrl}/admin/course/${cname}/${tname}/getvideos`)
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

    this.http
      .get(`${this.baseUrl}/admin/course/${cname}/courseinfo`)
      .subscribe((result: any) => {
        // console.log(result);
        this.description = result.description;
      });

    //Enrolled Users API
    this.http
      .get(`${this.baseUrl}/admin/course/getcourseusers/${cname}/${tname}`)
      .subscribe((data) => {
        // console.log(data);
        this.courseUsers = data;
      });
  }

  //EDIT MODULE DATA FUNCTIONS

  videosToAdd: { videoname: string; videolink: string }[] = [];

  AddNewVideo(moduleIndex: number) {
    const moduleData = this.courseData[moduleIndex];
    // console.log(typeof(moduleData));
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
    this.http
      .put(
        `${this.baseUrl}/admin/course/${cname}/${moduleId}/updatemodules`,
        requestData
      )
      .subscribe((result) => {
        console.log(result);

        this.popup = true;
        this.message = 'Module Updated Successfully!';

        setTimeout(() => {
          this.message = ' ';
          this.popup = false;
        }, 5000);
        window.location.reload();
      });
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

    // request data format to send to the backend
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
      .post(`${this.baseUrl}/admin/course/savevideo`, formattedData)
      .subscribe((result) => {
        this.popup = true;
        this.message = 'Module Created Successfully!';
        setTimeout(() => {
          this.popup = false;
          this.message = '';
        }, 5000);
        window.location.reload();
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
    // console.log(cname, moduleId);
    this.http
      .delete(`${this.baseUrl}/admin/course/${cname}/${moduleId}/deletemodule`)
      .subscribe(
        (response) => {
          console.log(response);
          this.popup = true;
          this.message = 'Module Deleted Successfully!';
          setTimeout(() => {
            this.popup = false;
            this.message = '';
          }, 5000);
          window.location.reload();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // User access/remove access from course

  enrollUser(email: any, cname: string, tname: string) {
    // console.log(email.userEmail,cname,tname);
    this.jwtToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.jwtToken}`,
      'Content-Type': 'application/json',
    });

    this.http
      .post(
        `${this.baseUrl}/admin/course/accesscoursetouser?courseUserEmail=${email.userEmail}&courseName=${cname}&trainerName=${tname}`,
        { headers }
      )
      .subscribe(
        (result) => {
          // console.log(result);
          
        },
        (error) => {
          console.log(error);
        }
      );
  }

  removeUserAccess(email: string, cname: string, tname: string) {
    console.log(email, cname, tname);
    this.jwtToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.jwtToken}`,
      'Content-Type': 'application/json',
    });
    // console.log(headers);

    this.http
      .patch(
        `${this.baseUrl}/admin/removecourseaccess/${email}/${cname}/${tname}`,
        {},
        { headers }
      )
      .subscribe(
        (data) => {
          console.log(data);
          this.popup = true;
          this.message = 'User Removed Successfully!';
          setTimeout(() => {
            this.popup = false;
            this.message = '';
          }, 5000);
          window.location.reload();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  add() {
    this.courselist = true;
    this.isShowAdd = true;
    this.isShowEdit = false;
    this.selectedListItem = null;
    this.user = false;
    this.courseEdit = false;
  }

  course() {
    if (this.courselist === false) {
      this.courselist = true;
    }
    this.user = false;
    this.courseEdit = false;
  }

  //tab states dynamic stylings
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

  // User functions

  users() {
    this.user = true;
    this.courselist = false;
    this.isShowAdd = false;
    this.isShowEdit = false;
    this.courseEdit = false;
  }

  sampleUsers() {
    // this.http.get(' http://localhost:8080/sample-file').subscribe();
  }

  userFind(user: any) {
    this.find = true;

    // console.log(user);

    this.http
      .get(`${this.baseUrl}/admin/course/getcourseuserinfo/${user.email}`)
      .subscribe((response: any) => {
        if (response !== null) {
          this.table = true;
          this.userInfo = response;
          console.log(this.userInfo);
        } else {
          this.table = false;
        }
      });
  }
}
