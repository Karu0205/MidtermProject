import { Injectable } from '@angular/core';
import { Firestore, collectionData, deleteDoc, doc, docData } from '@angular/fire/firestore';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

export interface Account{
  id?: string;
  student_id: string;
  student_username: string;
  student_password: string;
}

export interface Request{
  id?: string;
  student_name: string;
  document_type: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) { }

  getAccounts(): Observable<Account[]> {
    const notesRef = collection(this.firestore, 'accounts');
    return collectionData(notesRef, {idField: 'id'}) as Observable<Account[]>;
  }

  getRequests(): Observable<Request[]> {
    const notesRef = collection(this.firestore, 'requests');
    return collectionData(notesRef, {idField: 'id'}) as Observable<Request[]>;
  }

  getAccountById(id: any): Observable<Account> {
    const noteDocRef = doc(this.firestore,`notes/${id}`);
    return docData(noteDocRef, {idField: 'id'}) as Observable<Account>
  }

  getRequestById(id): Observable<Request> {
    const noteDocRef = doc(this.firestore, `requests/${id}`);
    return docData(noteDocRef, {idField: 'id'}) as Observable<Request>
  }

  addRequest(request: Request) {
    const notesRef = collection(this.firestore, 'requests');
    return addDoc(notesRef, request);
  }

  addAccount(account: Account) {
    const notesRef = collection(this.firestore, 'accounts');
    return addDoc(notesRef, account);
  }

  deleteRequest(request: Request) {
    const noteDocRef = doc(this.firestore, `requests/${request.id}`);
    return deleteDoc(noteDocRef);
  }

  updateRequest(request: Request){
    const noteDocRef = doc(this.firestore, `requests/${request.id}`);
    return updateDoc(noteDocRef, {student_name: request.student_name, document_type: request.document_type, status: request.status});
  }

}
