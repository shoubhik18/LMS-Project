export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  profile_picture: Blob | null | any;
  role: string;
}

export interface login {
  userEmail: string;
  password: string;
}

export interface editUser {
  userEmail: string;
  userName: string;
}
