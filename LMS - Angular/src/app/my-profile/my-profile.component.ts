import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { User, editUser } from '../user';
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
  tick = faCheckCircle;
  delete = faTrash;
  userId: string | any = localStorage.getItem('userId');
  emailData: string | any;
  myProfile: boolean | any;
  image: string | any = localStorage.getItem('image');

  // username: string = '';

  constructor(private auth: AuthService, private http: HttpClient) {
    this.emailData = localStorage.getItem('capitalizedEmail');
  }

  ngOnInit(): void {
    if (this.image.length > 3) {
      this.myProfile = true;
      // console.log(this.myProfile);
      // this.image = this.emailData;
      // console.log(this.image);
    } else {
      this.myProfile = false;
      // console.log(this.myProfile);
      this.image = localStorage.getItem('image');
      // console.log(this.image);
    }
  }

  editProfile(data: editUser) {
    console.log(data);

    let formData: FormData = new FormData();
    formData.append('userName', data.userName);
    formData.append('userEmail', data.userEmail);

    this.http
      .put(` ${this.baseUrl}/user/update/${this.userEmail}`, formData)
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
    formData.append('file', this.selectedFile);

    // Assuming this.userId is your user ID
    this.http
      .post(`${this.baseUrl}/user/uploadimage/${this.userEmail}`, formData)
      .subscribe(
        (response) => {
          console.log(response);
          // Handle success, e.g., show a success message
          alert('Profile picture updated successfully.');
        },
        (error) => {
          console.error('Error updating profile picture:', error);
          // Handle error, e.g., show an error message
          alert('Error updating profile picture.');
        }
      );
  }

  deletePic() {
    this.http
      .delete(`http://localhost:8080/deletePicture/${this.userId}`)
      .subscribe();
  }
}
