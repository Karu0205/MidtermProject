import { Injectable } from '@angular/core';
import { Firestore, collectionData, deleteDoc, doc, docData } from '@angular/fire/firestore';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";


export interface Account{
  id?: string;
  name: string;
  password: string;
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

  constructor(private firestore: Firestore, public fireStore: AngularFirestore,
    public auth: AngularFireAuth) { }

  loginWithEmail(data) {
    return this.auth.signInWithEmailAndPassword(data.email, data.password);
  }

  signup(data) {
    return this.auth.createUserWithEmailAndPassword(data.email, data.password);
  }

  saveDetails(data) {
    return this.fireStore.collection("users").doc(data.uid).set(data);
  }
  getDetails(data) {
    return this.fireStore.collection("users").doc(data.uid).valueChanges();
  }

  getAccounts(): Observable<Account[]> {
    const notesRef = collection(this.firestore, 'users');
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
    const notesRef = collection(this.firestore, 'users');
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
