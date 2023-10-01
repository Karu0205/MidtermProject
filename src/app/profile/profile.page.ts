import { Component, OnInit } from '@angular/core';
import { Account, FirebaseService, Request } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { UserService } from '../user.service';
import { Event } from '../event.model';
import { EventService } from '../event.service';




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

  
  events: Event[] = [];
  selectedEvent: Event = { title: '', description: '', startDate: new Date(), endDate: new Date() };

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController, private afAuth: AngularFireAuth,
    private firestore: AngularFirestore, private userService: UserService, private eventService: EventService ) {
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
    this.loadEvents();

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

  loadEvents() {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
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


  async deleteAccount() {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');
  
    if (confirmDelete) {
      try {
        const user = await this.afAuth.currentUser;
        if (user) {
          // Delete the user's Firestore document
          await this.dataService.deleteUser(user.uid);
  
          // Delete the user's Firebase Authentication account
          await user.delete();
  
          // Sign out the user
          await this.afAuth.signOut();
  
          this.router.navigate(['/login']);
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  }
  
}
