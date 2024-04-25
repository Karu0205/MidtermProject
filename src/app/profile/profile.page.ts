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
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EmailService } from '../email.service';
import { FormPage } from '../form/form.page';
import { SchedulePage } from '../schedule/schedule.page';
import { SettingsPage } from '../settings/settings.page';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  private subscription: Subscription;

  notificationCount = 0; // Initialize count

  numbers: number[] = [1, 2, 3, 4, 5, 6, 7];

  isAlertOpen = false;
  public alertButtons = ['OK'];

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  progressBarValue: number;
  inputRequestId: string = '';

  selectedImage: File | null = null;
  userProfile: any = {}; // Initialize an empty object for the user's profile data.
  desiredImageWidth = 200; // Adjust this to your desired width.
  desiredImageHeight = 200; // Adjust this to your desired height.


  userId: any;
  isLoggedIn: boolean;
  userName: any;
  userEmail: any;
  userData: any;
  userRequest: any[];

  accounts: Account[] = []; 
  requests: Request[] = []; 

  selectedRequestId: string | null = null;
  selectedRequest: any | null = null;

  
  events: Event[] = [];
  selectedEvent: Event = { title: '', description: '', startDate: new Date()};

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController, private afAuth: AngularFireAuth,
    private firestore: AngularFirestore, private userService: UserService, private eventService: EventService,
    private storage: AngularFireStorage, private emailService:EmailService ) {
      this.dataService.getAccounts().subscribe(res => {

        this.accounts=res;
      })
      this.dataService.getRequests().subscribe(req => {

        this.requests=req;
        this.updateProgressBarValue();
      })

      this.notificationsCollection = this.firestore.collection('notifications');

      // Subscribe to changes in the Firestore collection
      this.subscription = this.notificationsCollection.valueChanges().subscribe((data) => {
        this.notificationCount = data.length;
      });
     }

     updateProgressBarValue() {
      // For demonstration, we assume there's only one order in the requests array.
      if (this.requests && this.requests.length > 0) {
        const order = this.requests[0];
        switch (order.status) {
          case 'pending':
            this.progressBarValue = 10;
            break;
          case 'accepted':
            this.progressBarValue = 30;
            break;
          case 'in progress':
            this.progressBarValue = 50;
            break;
          case 'ready for pickup':
            this.progressBarValue = 70;
            break;
          case 'completed':
            this.progressBarValue = 100;
            break;
          default:
            this.progressBarValue = 0;
            break;
        }
      } else {
        this.progressBarValue = 0;
      }
    }

    showFileUpload: boolean = false;

    toggleFileUpload() {
      this.showFileUpload = !this.showFileUpload;
    }

     onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImage = file;
        };
        reader.readAsDataURL(file);
      }
    }
  
    async uploadImage() {
      if (!this.selectedImage || !this.userId) {
        console.error('No image selected or user not logged in.');
        return;
      }
  
      const filePath = `/user-profiles/${this.userId}/profile-picture.jpg`;
      const fileRef = this.storage.ref(filePath);
  
      // Create an HTML Image element to load the selected image.
      const img = new Image();
      img.src = URL.createObjectURL(this.selectedImage);
  
      // Wait for the image to load.
      img.onload = async () => {
        // Create a canvas to resize the image.
        const canvas = document.createElement('canvas');
        if (!canvas) {
          console.error('Canvas could not be created.');
          return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('Canvas context (ctx) is null.');
          return;
        }
        canvas.width = this.desiredImageWidth;
        canvas.height = this.desiredImageHeight;
  
        // Resize and draw the image on the canvas.
        ctx.drawImage(img, 0, 0, this.desiredImageWidth, this.desiredImageHeight);
  
        // Convert the canvas content to a Blob (JPEG format).
        canvas.toBlob(async (blob) => {
          if (blob) {
            // Upload the resized image (Blob) to Firebase Storage.
            const task = this.storage.upload(filePath, blob);
  
            // Finalize the upload process.
            task.snapshotChanges().pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe((url) => {
                  // Update the user's profile in Firestore with the image URL.
                  this.updateUserProfile(this.userId, { profilePicture: url });
                });
              })
            ).subscribe();
          }
        }, 'image/jpeg'); // You can adjust the format if needed.
      };
    }

    async openFormModal() {
      const modal = await this.modalCtrl.create({
        component: FormPage, // Use your form component here
      });

      modal.componentProps = {
        userEmail: this.userEmail,
        userName: this.userName,
        userId: this.userId,
      };
  
      return await modal.present();
    }

    async openSchedModal() {
      const modal = await this.modalCtrl.create({
        component: SchedulePage, // Use your form component here
      });
  
      return await modal.present();
    }

    async openSettingsModal() {
      const modal = await this.modalCtrl.create({
        component: SettingsPage, // Use your form component here
      });
  
      return await modal.present();
    }


  
    fetchUserProfile(userId: string) {
      const userRef = this.firestore.collection('users').doc(userId);
      userRef.valueChanges().subscribe((data) => {
        this.userProfile = data;
      });
    }
  
    updateUserProfile(userId: string, data: any) {
      const userRef = this.firestore.collection('users').doc(userId);
      userRef.update(data)
        .then(() => {
          console.log('User profile updated successfully');
        })
        .catch((error) => {
          console.error('Error updating user profile:', error);
        });
    }

  ngOnInit() {

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid; // Store the current user's UID.
        this.fetchUserProfile(this.userId);
      } else {
        // Handle user not logged in.
      }
    });

    this.loadEvents();

    this.afAuth.authState.subscribe(user => {
      if (user) {

        this.dataService.getUserDataByUID(user.uid).subscribe(rq => {
          this.userRequest = rq;

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

  askForRequestId() {
    const reqId = this.inputRequestId;
  
    if (reqId) {
      // Set the selected request ID and fetch the corresponding request
      this.selectedRequestId = reqId;
      this.selectedRequest = this.userRequest.find((rq) => rq.req_id === reqId);
    }
  }


 async initializeItems(): Promise<any> {
    const requests = await this.firestore.collection('requests').valueChanges().pipe(first()).toPromise();
    return requests;
  }

  async filterList(event) {
    this.requests = await this.initializeItems();
    const searchTerm = event.target.value;

  
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
    this.router.navigate(['/login']);
    this.afAuth.signOut().then(() => {
      // Handle successful logout (e.g., navigate to login page).
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  }

  logIn(){
    this.router.navigate(['/documents'])
  }

  home(){
    this.router.navigate(['/reminders'])
  }


  openForm(){
    this.router.navigate(['/form'])
  }

  toProfile(){
    this.router.navigate(['/profile'])
  }

  calculateProgress(status: string): number {
    if (status.includes('Pending')) {
      return 15;
    } else if (status.includes('Request being handled by: ')) {
      return 30;
    } else if (status.includes('Accepted at the Registrar\'s Office by: ')) {
      return 30;
    } else if (status.includes('Request forwarded to the principal’s office')) {
      return 47;
    } else if (status.includes('Request returned to the registrar for review')) {
      return 63;
    } else if (status.includes('Request is signed by the principal')) {
      return 63;
    } else if (status.includes('Ready for Pickup at the Registrar\'s Office')) {
      return 100;
    } else {
      return 0;
    }
  }

  getLabelColor(status: string, labelToHighlight: string, targetProgress: number): string {
    const progress = this.calculateProgress(status);
    if (progress >= targetProgress) {
      return 'green';
    } else {
      return 'grey';
    }
  }
  

  // Function to get progress label based on status
  getProgressLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'Request being handled by: ' + this.userData.displayName:
        return 'Being Handled';
      case 'Accepted at the Registrar\'s Office by: ' + this.userData.displayName:
        return 'Accepted at Registrar\'s Office';
      case 'Request forwarded to the principal’s office':
        return 'Forwarded to Principal’s Office';
      case 'Accepted at the Principal\'s Office by: ' + this.userData.displayName:
        return 'Accepted at Principal\'s Office';
      case 'Request is signed by the principal':
        return 'Request Signed by Principal';
      case 'Ready for Pickup at the Registrar\'s Office':
        return 'Ready for Pickup';
      default:
        return '';
    }
  }


  async deleteAccount() {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');
    
    if (confirmDelete) {
      try {
        const user = await this.afAuth.currentUser;
        if (user) {
          // Prompt the user to log in again to confirm their identity
          const email = prompt('Please enter your email:');
          const password = prompt('Please enter your password:');
  
          if (email && password) {
            try {
              // Sign in the user with email and password for confirmation
              await this.afAuth.signInWithEmailAndPassword(email, password);
  
              // Delete the user's Firestore document
              await this.dataService.deleteUser(user.uid);
  
              // Delete the user's Firebase Authentication account
              await user.delete();
  
              // Sign out the user
              await this.afAuth.signOut();
  
              this.router.navigate(['/login']);
            } catch (error) {
              console.error('Error confirming account deletion:', error);
            }
          } else {
            // User canceled email or password entry
            console.log('Account deletion canceled.');
          }
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  }

  async addRequest() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
  
    const alert = await this.alertCtrl.create({
      header: 'Confirm Request?',
      inputs: [
        {
          name: 'student_name',
          value: this.userData.displayName,
          type: 'text',
          disabled: true
        },
        {
          name: 'document_type',
          value: 'Form 137',
          type: 'text',
          disabled: true
        },
        {
          name: 'email',
          value: this.userData.email,
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Pending',
          type: 'text',
          disabled: true
        },
        {
          name: 'student_id',
          value: this.userData.uid,
          type: 'text',
          disabled: true,
          cssClass: 'invisible-input',
        },
        {
          name: 'request_date',
          value: formattedDate,
          type: 'text',
          disabled: true
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (req) => {
            this.dataService.addRequest(req); // Include the entire request object
            this.setOpen(true);
            this.emailService.sendEmail('kalatasservices@gmail.com', 'There is a new Form 137 request', this.userData.displayName);
          }
        }
      ]
    });
    await alert.present();
  }

    // Create a reference to your Firestore collection
    notificationsCollection = this.firestore.collection('notifications');

    addNotification() {
      this.notificationsCollection.add({ /* your data */ }).then(() => {
        this.notificationCount++; // Increment the count
      });
    }

    clearNotifications() {
      // Clear notifications by resetting the count and removing all entries from the collection
      this.notificationCount = 0;
      this.notificationsCollection.get().subscribe((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
    }


  
}
