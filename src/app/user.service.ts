import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  deleteUser(): Promise<void> {
    return this.afAuth.authState.pipe().toPromise().then(async (user) => {
      if (user) {
        // Remove the user from the 'users' collection first.
        await this.firestore.collection('users').doc(user.uid).delete();

        // Delete the user from Firebase Authentication.
        await user.delete();
      }
    });
  }

  updatePassword(newPassword: string): Promise<void> {
    return this.afAuth.authState.pipe().toPromise().then(async (user) => {
      if (user) {
        await user.updatePassword(newPassword);
      }
    });
  }
}
