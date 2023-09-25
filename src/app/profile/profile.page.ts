import { Component, OnInit } from '@angular/core';
import { Account, FirebaseService, Request } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userId: any;
  isLoggedIn: boolean;
  userName: any;
  userEmail: any;
  userData: any;
  userRequest: any[];

  accounts: Account[] = []; 
  requests: Request[] = []; 

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController, private afAuth: AngularFireAuth,
    private firestore: AngularFirestore ) {
      this.dataService.getAccounts().subscribe(res => {
        console.log(res);
        this.accounts=res;
      })
      this.dataService.getRequests().subscribe(req => {
        console.log(req);
        this.requests=req;
      })
     }

  

  ngOnInit() {

    this.afAuth.authState.subscribe(user => {
      if (user) {

        this.dataService.getUserDataByUID(user.uid).subscribe(rq => {
          this.userRequest = rq;
          console.log(user.uid);
        });

        this.firestore
        .collection('users')
        .doc(user.uid)
        .valueChanges()
        .subscribe((data) => {
          this.userData = data;
        });
        // User is logged in
        this.isLoggedIn = true;
        this.userId = user.uid; // Retrieve the user ID
        this.userEmail = user.email;
        this.userName = user.displayName// Retrieve the user name
        console.log('User ID:', this.userId);
        console.log('User Email:', this.userEmail);
        console.log('User Name:', this.userName);
      } else {
        // User is not logged in
        this.isLoggedIn = false;
        this.userId = null;
        this.userName = null;

      }
    });
  }

 async initializeItems(): Promise<any> {
    const requests = await this.firestore.collection('requests').valueChanges().pipe(first()).toPromise();
    return requests;
  }

  async filterList(event) {
    this.requests = await this.initializeItems();
    const searchTerm = event.target.value;
    console.log(searchTerm);
  
    if (!searchTerm) {
      this.userRequest = this.requests; // Reset the userRequest array to its original state
      return;
    }
  
    this.userRequest = this.requests.filter((currentReq) => {
      if (currentReq.student_name && searchTerm) {
        return (
          currentReq.student_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
          currentReq.status.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
          currentReq.document_type.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        );
      }
      return false;
    });
  }

  accountList(){

  }

  requestList(){

  }

  logOut(){
    this.dataService.logout();
    this.router.navigate(['/login'])
  }

  logIn(){
    this.router.navigate(['/documents'])
  }

  openForm(){
    this.router.navigate(['/form'])
  }

  toProfile(){
    this.router.navigate(['/profile'])
  }
  

}
