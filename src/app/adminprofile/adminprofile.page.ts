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
import { NotificationService } from '../notification.service';
import { Subscription } from 'rxjs';
import { CalendarPage } from '../calendar/calendar.page';
import { SignupPage } from '../signup/signup.page';
import { AdmindocuPage } from '../admindocu/admindocu.page';
import { CompletedPage } from '../completed/completed.page';
import { ApprovalPage } from '../approval/approval.page';
import { StorageMenuPage } from '../storage-menu/storage-menu.page';
import { ModalPage } from '../modal/modal.page';
import { PrincipalPage } from '../principal/principal.page';
import { StoragePage } from '../storage/storage.page';
import { EscPage } from '../esc/esc.page';
import { GoodmoralPage } from '../goodmoral/goodmoral.page';
import { CompletionPage } from '../completion/completion.page';
import { EnrollmentPage } from '../enrollment/enrollment.page';
import { RankingPage } from '../ranking/ranking.page';
import { CemiPage } from '../cemi/cemi.page';
import { EditstudentPage } from '../editstudent/editstudent.page';


@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.page.html',
  styleUrls: ['./adminprofile.page.scss'],
})
export class AdminprofilePage implements OnInit {

  private subscription: Subscription;

  
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7];

  isAlertOpen = false;
  public alertButtons = ['OK'];

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  progressBarValue: number;

  selectedImage: File | null = null;
  userProfile: any = {}; // Initialize an empty object for the user's profile data.
  desiredImageWidth = 200; // Adjust this to your desired width.
  desiredImageHeight = 200; // Adjust this to your desired height.

  
  notificationCount = 0; // Initialize count

  notificationCount2 = 0; // Initialize count

  fromName: string;
  initialFromName: string;

  toEmail: string = '';
  subject: string = '';
  message: string = '';

  selectedDocumentTypeFilter: string = '';
  selectedStrandFilter: string = '';
  selectedStatusFilter: string = '';
  selectedNewFilter: string = '';

  documentTypeFilterText: string = '';
strandFilterText: string = '';

  showPassword: boolean = false;
  items: any[];
  searchText: string;

  selectedDocumentType: string = "";


  userId: any;
  isLoggedIn: boolean;
  userName: any;
  userEmail: any;
  userData: any;
  userRequest: any[];

  accounts: Account[] = []; 
  requests: Request[] = []; 

  
  events: Event[] = [];
  selectedEvent: Event = { title: '', description: '', startDate: new Date()};

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController, private afAuth: AngularFireAuth,
    private firestore: AngularFirestore, private userService: UserService, private eventService: EventService,
    private storage: AngularFireStorage, private emailService:EmailService, private notificationService: NotificationService ) {
      
      this.fromName = 'Sto. Nino Formation and Science School'; // Set this to the default value
      this.initialFromName = this.fromName;

      this.dataService.getAccounts().subscribe(res => {

        this.accounts=res;
      })
      this.dataService.getRequests().subscribe(req => {
        this.requests = req.sort((a, b) => {
          // Sorting based on docu_status
          if (a.doc_status === 'Signed' && b.doc_status !== 'Signed') {
            return -1; // "Signed" comes first
          } else if (a.doc_status !== 'Signed' && b.doc_status === 'Signed') {
            return 1; // "Signed" comes after others
          } else if (a.doc_status === 'For review' && b.doc_status !== 'For review') {
            return -1; // "For review" comes after "Signed"
          } else if (a.doc_status !== 'For review' && b.doc_status === 'For review') {
            return 1; // "Signed" comes after "For review"
          } else if (a.doc_status === 'New' && b.doc_status !== 'New') {
            return -1; // "New" comes next
          } else if (a.doc_status !== 'New' && b.doc_status === 'New') {
            return 1; // "New" comes after others
          } else {
            // If docu_status is the same or both are not "New" or "Signed" or "For review", sort by request_date
            return new Date(b.request_date).getTime() - new Date(a.request_date).getTime();
          }
        });
      });
      

      this.notificationsCollection = this.firestore.collection('notifications');

      this.subscription = this.notificationsCollection.valueChanges().subscribe((data) => {
        this.notificationCount = data.length;
      });

      this.notificationsCollection2 = this.firestore.collection('notifications2');

      this.subscription = this.notificationsCollection2.valueChanges().subscribe((data) => {
        this.notificationCount2 = data.length;
      });
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
 
     async openAccountsModal() {
       const modal = await this.modalCtrl.create({
         component: SignupPage, // Use your form component here
         cssClass: 'my-custom-modal-css'

       });
   
       return await modal.present();
     }

     async openStorageModal() {
      const modal = await this.modalCtrl.create({
        component: StorageMenuPage, // Use your form component here
      });
  
      return await modal.present();
    }

     async openApprovalModal() {
      const modal = await this.modalCtrl.create({
        component: ApprovalPage, // Use your form component here
      });
      this.clearNotifications2();
      return await modal.present();
    }

     async openRequestsModal() {
      const modal = await this.modalCtrl.create({
        component: AdmindocuPage, // Use your form component here
      });

      this.clearNotifications();
  
      return await modal.present();
    }

    
  async openRequest(request: Request){
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { id: request.id },
    });
    modal.present();
  }

  async openPrincipal(request){
    const modal = await this.modalCtrl.create({
      component: PrincipalPage,
      componentProps: { id: request.id },
    });
    modal.present();
  }

  showDropdown: boolean = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  handleItemClick(buttonLabel: string) {
    // Handle the click event for each button in the dropdown
    console.log(`Clicked on ${buttonLabel}`);
    // Add your logic here, if needed
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  async open137Modal() {
    const modal = await this.modalCtrl.create({
      component: StoragePage, // Use your form component here
    });

    return await modal.present();
  }

  async openESCModal() {
    const modal = await this.modalCtrl.create({
      component: EscPage, // Use your form component here
    });

    return await modal.present();
  }

  async openGoodMoralModal() {
    const modal = await this.modalCtrl.create({
      component: GoodmoralPage, // Use your form component here
    });

    return await modal.present();
  }

  async openCompletionModal() {
    const modal = await this.modalCtrl.create({
      component: CompletionPage, // Use your form component here
    });

    return await modal.present();
  }

  async openEnrollmentModal() {
    const modal = await this.modalCtrl.create({
      component: EnrollmentPage, // Use your form component here
    });

    return await modal.present();
  }

  async openRankingModal() {
    const modal = await this.modalCtrl.create({
      component: RankingPage, // Use your form component here
    });

    return await modal.present();
  }

  async openCEMIModal() {
    const modal = await this.modalCtrl.create({
      component: CemiPage, // Use your form component here
    });

    return await modal.present();
  }


    async openCompletedModal() {
      const modal = await this.modalCtrl.create({
        component: CompletedPage, // Use your form component here
      });

      this.clearNotifications();
  
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

     async openCalendarModal() {
      const modal = await this.modalCtrl.create({
        component: CalendarPage, // Use your form component here
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

    this.notificationService.getNotificationCount().subscribe(count => {
      this.notificationCount = count;
    });
 
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

   searchItems() {
    console.log('SearchItems method called');
  
    if (!this.searchText) {
      // If the search text is empty, display all items and sort them.
      this.dataService.getItems().subscribe((requests) => {
        this.requests = requests;
        this.sortRequests();
        console.log('All items sorted:', this.requests); // Log the items retrieved
      });
    } else {
      // If there is a search text, filter items based on it.
      this.dataService.getItems().subscribe((requests) => {
        const filteredRequests = requests.filter((request) => {
          const searchTextLower = this.searchText.toLowerCase();
          const match =
            request.student_name.toLowerCase().includes(searchTextLower) ||
            request.status.toLowerCase().includes(searchTextLower) ||
            request.request_date.toLowerCase().includes(searchTextLower) ||
            request.document_type.toLowerCase().includes(searchTextLower);
          return match;
        });
        this.requests = filteredRequests;
        console.log('Filtered items:', this.requests); // Log the filtered items
      });
    }
  }
  onSearchTextChange() {
    this.applySearchFilter();
    this.applyFilters();
  }

  applyFilters() {
    // Filter based on dropdown filters (document_type and strand)
    this.dataService.getItems().subscribe((requests) => {
      this.requests = requests.filter((request) => {
        const documentTypeFilterMatch = this.selectedDocumentTypeFilter === '' || request.document_type === this.selectedDocumentTypeFilter;
        const strandFilterMatch = this.selectedStrandFilter === '' || request.strand === this.selectedStrandFilter;
        const StatusFilterMatch = this.selectedStatusFilter === '' || request.Status === this.selectedStatusFilter;
        const StatusNewMatch = this.selectedNewFilter === '' || request.doc_status === this.selectedNewFilter;
  
        return documentTypeFilterMatch && strandFilterMatch && StatusFilterMatch && StatusNewMatch;
      });
      this.applySearchFilter();
    });
  }
  
  applySearchFilter() {
    // Apply the search bar filter in the filtered requests
    const searchTextLower = this.searchText.toLowerCase();
    this.requests = this.requests.filter((request) =>
      request.student_name.toLowerCase().includes(searchTextLower) ||
      request.request_date.toLowerCase().includes(searchTextLower) ||
      request.lrn.toLowerCase().includes(searchTextLower) ||
      request.document_type.toLowerCase().includes(searchTextLower) ||
      request.req_id?.toLowerCase().includes(searchTextLower) ||
      request.status.toLowerCase().includes(searchTextLower)
    );
    this.sortRequests();
  }
  
  
  
 // sortRequests() {
    // Sort the requests by request_date in descending order (newest to oldest).
  //  this.requests = this.requests.sort((a, b) => {
  //    const dateA = new Date(a.request_date).getTime();
  //    const dateB = new Date(b.request_date).getTime();
  //   return dateB - dateA;
 //   });
 // }

 sortRequests() {
  this.requests = this.requests.sort((a, b) => {
    // Sorting based on docu_status
    if (a.doc_status === 'Signed' && b.doc_status !== 'Signed') {
      return -1; // "Signed" comes first
    } else if (a.doc_status !== 'Signed' && b.doc_status === 'Signed') {
      return 1; // "Signed" comes after others
    } else if (a.doc_status === 'New' && b.doc_status !== 'New') {
      return -1; // "New" comes next
    } else if (a.doc_status !== 'New' && b.doc_status === 'New') {
      return 1; // "New" comes after others
    } else {
      // If docu_status is the same or both are not "New" or "Signed", sort by request_date
      return new Date(b.request_date).getTime() - new Date(a.request_date).getTime();
    }
  });
}

  
 
   loadEvents() {
     this.eventService.getEvents().subscribe((events) => {
       this.events = events;
     });
   }

  calculateProgress(status: string): number {
    if (!status) {
      return 0; // or some default value if status is undefined
    }
  
    if (status.includes('Pending')) {
      return 15;
    } else if (status.includes('Request being handled by: ')) {
      return 30;
    } else if (status.includes('Accepted at the Registrar\'s Office by: ')) {
      return 30;
    } else if (status.includes('Request forwarded to the principal’s office')) {
      return 47;
    } else if (status.includes('Request returned to the registrar for review')) {
      return 30;
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
 
   logOut(){
    this.dataService.logout();
    this.router.navigate(['/adminlogin'])
    this.afAuth.signOut().then(() => {
      // Handle successful logout (e.g., navigate to login page).
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  }

  openDocu(){
    this.router.navigate(['/admindocu'])
  }

  async openAccountModal() {
    const modal = await this.modalCtrl.create({
      component: EditstudentPage, // Use your form component here
    });

    return await modal.present();
  }

  openRegister(){
    this.clearNotifications();
    this.router.navigate(['/signup'])
  }

  openStorage(){
    this.router.navigate(['/storage-menu'])
  }

  openCalendar(){
    this.router.navigate(['/calendar'])
  }

       // Create a reference to your Firestore collection
       notificationsCollection = this.firestore.collection('notifications');
       notificationsCollection2 = this.firestore.collection('notifications2');


  // Increment the notification count
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

    // Increment the notification count
    addNotification2() {
      this.notificationsCollection2.add({ /* your data */ }).then(() => {
        this.notificationCount2++; // Increment the count
      });
    }
  
    clearNotifications2() {
      // Clear notifications by resetting the count and removing all entries from the collection
      this.notificationCount2 = 0;
      this.notificationsCollection2.get().subscribe((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
    }
    

}
