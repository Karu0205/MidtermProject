import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  async login ({ student_username, student_password }) {
    try{
      const user = await signInWithEmailAndPassword(
        this.auth,
        student_username,
        student_password
      );
      return user;
    } catch (e) {
      return null;
    }
  }

  logout(){
    return signOut(this.auth);
  }
}
