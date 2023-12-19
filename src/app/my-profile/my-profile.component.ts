import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
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
  userName: string | any = localStorage.getItem('username');
  userEmail: string | any = localStorage.getItem('email');
  tick = faCheckCircle;
  delete = faTrash;
  userId: string | any = localStorage.getItem('userId');
  emailData: string | any;
  myProfile: boolean | any;
  image: string | any = localStorage.getItem('image');

  private baseURL = 'http://localhost:8080/user';
  // username: string = '';

  constructor(
    private auth: AuthService,
    private userservice: UserService,
    private http: HttpClient
  ) {
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
    this.http
      .put(
        ` http://localhost:8080/user/update?UserEmail=${this.userEmail}`,
        data
      )
      .subscribe((result) => {
        console.log(data);

        if (result) {
          alert('updated successfully');
        } else {
          alert('error');
        }
      });
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  onSelectFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      this.updateProfile(file);
    }
  }

  updateProfile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    // Assuming this.userId is your user ID
    this.http
      .put(
        `http://localhost:8080/updateProfilePicture/${this.userId}`,
        formData
      )
      .subscribe(
        (response) => {
          console.log(response);
          // Handle success, e.g., show a success message
        },
        (error) => {
          console.error('Error updating profile picture:', error);
          // Handle error, e.g., show an error message
        }
      );
  }

  deletePic() {
    this.http
      .delete(`http://localhost:8080/deletePicture/${this.userId}`)
      .subscribe();
  }
}
