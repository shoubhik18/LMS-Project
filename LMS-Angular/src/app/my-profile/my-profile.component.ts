import { Component } from '@angular/core';
import { AuthService } from '../service-floder/auth.service';
import { editUser } from '../user';
import { HttpClient } from '@angular/common/http';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent {
  baseUrl: any = this.auth.getBaseUrl();

  userName: string | any = localStorage.getItem('username');
  userEmail: string | any = localStorage.getItem('email');
  oldEmail:string | any = localStorage.getItem('email');
  userId: string | any = localStorage.getItem('userId');
  emailData: string | any;
  myProfile: boolean | any;
  image: string | any = localStorage.getItem('image');

  // icons
  tick = faCheckCircle;
  delete = faTrash;

  constructor(private auth: AuthService, private http: HttpClient) {
    this.emailData = localStorage.getItem('capitalizedEmail');
  }

  ngOnInit(): void {
    if (this.image.length > 3) {
      this.myProfile = true;
    } else {
      this.myProfile = false;
      this.image = localStorage.getItem('image');
    }

    //to get the image when it is updated again 
    this.http.get(`${this.baseUrl}/user/downloadimage/${this.userEmail}`,{ responseType: 'text' }).subscribe((result)=>{
      if(result.startsWith('data:image/png;base64')){
        localStorage.setItem('image', result);
        this.image = result;
      }
    })
  }

  editProfile(data: editUser) {
    console.log(data);

    let formData: FormData = new FormData();
    formData.append('userName', data.userName);
    formData.append('userEmail', data.userEmail);

    this.http
      .put(` ${this.baseUrl}/user/update/${this.oldEmail}`, formData)
      .subscribe(
        (result: any) => {
          console.log(result);

          if (result) {
            localStorage.setItem('username', result.userName);
            localStorage.setItem('email', result.userEmail);
            alert('updated successfully');
          } else {
            alert('error');
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

// store selected profile picture
  selectedFile: File | null = null;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updatePic() {
    if (!this.selectedFile) {
      // Handle the case where no file is selected
      console.error('No file selected.');
      return;
    }
  
    let formData: FormData = new FormData();
    formData.append('photo', this.selectedFile);
  
    
    this.http
      .post(`${this.baseUrl}/user/uploadimage/${this.userEmail}`, formData,{ responseType: 'text' })
      .subscribe(
        (response) => {
          console.log(response);
          alert('Profile picture updated successfully.');
          this.image = response
          window.location.reload()
        },
        (error) => {
          console.error('Error updating profile picture:', error);
          alert('Error updating profile picture.');
        }
      );
  }
  
}
