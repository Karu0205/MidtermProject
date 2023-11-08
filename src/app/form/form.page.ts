import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ModalController, NavParams } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Account, FirebaseService, Request } from '../service/firebase.service';
import { DatePipe } from '@angular/common';
import { EmailService } from '../email.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-form',
  templateUrl: 'form.page.html',
  styleUrls: ['form.page.scss'],
})
export class FormPage {
  formData = {
    student_name: '',
    document_type: '',
    status: '',
    student_id: '',
    email: '',
    request_date: '',
    lrn: '',
    contact_no: '',
    year_level: '',
    strand: '',
    quantity: 1,
    Status: ''
  };
  showStatusInput: boolean = false;

  documentTypes: string[] = [
    'Form 137',
    'ESC Certificate',
    'Enrollment Form',
    'Certificate of Good Moral',
    'Certificate of Completion',
    'Certifiacte of Ranking',
    'Certificate of English as Medium of Instruction'
  ]; 

  selectedDocumentType: string;

  constructor(private afDB: AngularFireDatabase, private modalController: ModalController, private afAuth: AngularFireAuth,
    private firestore: AngularFirestore, private dataService:FirebaseService, private navParams: NavParams,
    private emailService:EmailService, private alertController:AlertController) {
      this.formData.email = this.navParams.get('userEmail');
      this.formData.student_name = this.navParams.get('userName');
      this.formData.student_id = this.navParams.get('userId');
      this.formData.Status = this.navParams.get('Status');
      this.formData.lrn = this.navParams.get('lrn');
      this.formData.contact_no = this.navParams.get('contact_no');
      this.formData.year_level = this.navParams.get('year_level');
      this.formData.strand = this.navParams.get('strand');
      this.formData.quantity = this.navParams.get('quantity');
      this.formData.document_type = this.navParams.get('document_type');
    }

  userName: any;
  lrn: any;
  userEmail: any;
  userId: any;
  userProfile: any = {}; // Initialize an empty object for the user's profile data.
  userData: any;
  userRequest: any[];
  isLoggedIn: boolean;


  async submitForm() {
    const alert = await this.alertController.create({
      header: 'Confirm Request Submission',
      message: 'Are you sure you want to submit this request? This request is final and cannot be changed.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // User canceled the request submission.
          }
        },
        {
          text: 'Submit',
          handler: () => {
            // Create a new Date object
            const currentDate = new Date();
            // Format the date as "yyyy-MM-dd"
            const formattedDate = currentDate.toISOString().slice(0, 10);
            // Set the request_date field to the formatted date
            this.formData.request_date = formattedDate;
            this.formData.status = 'Pending';
  
            // Check if year_level is undefined or empty, and set a default value if needed
            if (!this.formData.year_level) {
              this.formData.year_level = 'n/a';
            }
  
            // Check if strand is undefined or empty, and set a default value if needed
            if (!this.formData.strand) {
              this.formData.strand = 'n/a';
            }
  
            // Log the initial value of formData.status
            console.log('Initial status:', this.formData.status);
  
            // Try to add the request to the "requests" collection using your data service
            this.dataService.addRequest(this.formData)
              .then(() => {
                // Request was added successfully
                this.modalController.dismiss();
  
                // Reset the form after successful submission
                this.formData = {
                  student_name: this.navParams.get('userName'),
                  document_type: this.navParams.get('document_type'),
                  status: 'Pending',
                  student_id: this.navParams.get('userId'),
                  email: this.navParams.get('userEmail'),
                  Status: this.navParams.get('Status'),
                  lrn: this.navParams.get('lrn'),
                  contact_no: this.navParams.get('contact_no'),
                  year_level: 'n/a', // Set a default value for year_level
                  strand: 'n/a', // Set a default value for strand
                  quantity: this.navParams.get('quantity'),
                  request_date: formattedDate, // Set the request_date to the formatted date
                };
                this.addNotification();
                const emailSubject = `There is a new ${this.selectedDocumentType} request from ${this.userData.email}`;
                this.emailService.sendEmail('90.002.snfss@gmail.com', emailSubject, this.userData.displayName);
                this.emailService.sendEmail('90.003.snfss@gmail.com', emailSubject, this.userData.displayName);
                window.alert('Your request has been sent, kindly await updates and check your emails.');
              })
              .catch(error => {
                // Request failed to add
                console.error('Error adding request:', error);
                window.alert('An error occurred while adding the request.');
              });
          }
        }
      ]
    });
  
    await alert.present();
  }
  increaseQuantity() {
    this.formData.quantity += 1;
  }

  // Function to decrease the quantity
  decreaseQuantity() {
    if (this.formData.quantity > 1) {
      this.formData.quantity -= 1;
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.fetchUserProfile(this.userId);
      } else {
        // Handle user not logged in.
      }
    });
  
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.dataService.getUserDataByUID(user.uid).subscribe((rq) => {
          this.userRequest = rq;
        });
  
        this.firestore
          .collection('users')
          .doc(user.uid)
          .valueChanges()
          .subscribe((data) => {
            this.userData = data;
            this.formData.student_name = this.userData.displayName; // Set it here
            this.formData.Status = this.userData.Status
            this.formData.lrn = this.userData.lrn
            this.formData.contact_no = this.userData.contact_no
            this.formData.year_level = this.userData.year_level
            this.formData.strand = this.userData.strand
            this.formData.quantity = this.userData.quantity
            this.formData.document_type = this.userData.document_type
          });
        // User is logged in
        this.isLoggedIn = true;
        this.userId = user.uid;
        this.userEmail = user.email;
        this.userName = user.displayName;
      } else {
        // User is not logged in
        this.isLoggedIn = false;
        this.userId = null;
        this.userName = null;
      }
    });
  }
  

  
  fetchUserProfile(userId: string) {
    const userRef = this.firestore.collection('users').doc(userId);
    userRef.valueChanges().subscribe((data) => {
      this.userProfile = data;
    });
  }

  notificationCount = 0; // Initialize count

  notificationsCollection = this.firestore.collection('notifications');

  addNotification() {
    this.notificationsCollection.add({ /* your data */ }).then(() => {
      this.notificationCount++; // Increment the count
    });
  }

}