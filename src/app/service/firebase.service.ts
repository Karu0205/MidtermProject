import { Injectable } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { Observable } from 'rxjs';

export interface Account{
  id?: string;
  student_id: string;
  student_username: string;
  student_password: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) { }

  getAccounts(): Observable<Account[]> {
    const notesRef = collection(this.firestore, 'accounts');
    return collectionData(notesRef, {idField: 'myAccountID'}) as Observable<Account[]>;
  }

  addAccount(account: Account) {
    const notesRef = collection(this.firestore, 'accounts');
    return addDoc(notesRef, account);
  }

}
