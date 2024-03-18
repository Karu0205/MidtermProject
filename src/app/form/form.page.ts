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
    doc_status: '',
    payment: '',
    remarks: '',
    comments: '',
    Status: '',
    comment: ''
  };
  showStatusInput: boolean = false;
  selectedDocumentTypes: string[] = [];

  documentOptions = [
    { label: 'Form 137', value: 'Form 137', checked: false, quantity: 0 },
    { label: 'ESC Certificate', value: 'ESC Certificate', checked: false, quantity: 0 },
    { label: 'Enrollment Form', value: 'Enrollment Form', checked: false, quantity: 0 },
    { label: 'Certificate of Good Moral', value: 'Certificate of Good Moral', checked: false, quantity: 0 },
    { label: 'Certificate of Completion', value: 'Certificate of Completion', checked: false, quantity: 0 },
    { label: 'Certifiacte of Ranking', value: 'Certifiacte of Ranking', checked: false, quantity: 0 },
    { label: 'Certificate of English as Medium of Instruction', checked: false, value: 'Certificate of English as Medium of Instruction', quantity: 0 },
  ];

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
      this.formData.document_type = this.navParams.get('document_type');
      this.formData.doc_status = this.navParams.get('doc_status');
      this.formData.payment = this.navParams.get('payment');
      this.formData.remarks = this.navParams.get('remarks');
      this.formData.comment = this.navParams.get('comment');
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
    try {
      // Filter out the selected document types with non-zero quantity
      const selectedOptions = this.documentOptions.filter(option => option.checked && option.quantity > 0);
  
      // Check if any selected option has quantity 0
      if (selectedOptions.length === 0) {
        window.alert('Please select at least one document type with a quantity greater than 0.');
        return; // Prevent further execution
      }
  
      // Set formData.document_type to the selected document types with quantities
      this.formData.document_type = selectedOptions
        .map(option => `${option.label} (${option.quantity})`)
        .join(', ');
  
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
            handler: async () => {
              // Try to add the request to the "requests" collection using your data service
              try {
                // Validate required fields
                if (!this.formData.email || !this.formData.student_name || !this.formData.document_type) {
                  throw new Error('Missing required fields.');
                }
  
                // Additional validation if needed
  
                // Create a new Date object
                const currentDate = new Date();
                // Format the date as "yyyy-MM-dd"
                const formattedDate = currentDate.toISOString().slice(0, 10);
                // Set the request_date field to the formatted date
                this.formData.request_date = formattedDate;
                this.formData.status = 'Pending';
                this.formData.doc_status = 'New';
                this.formData.payment = 'Not Paid';
                this.formData.comment = ' ';
                this.formData.comments = ' ';
  
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
  
                // Add the request to the "requests" collection using your data service
                await this.dataService.addRequest(this.formData);
  
                // Request was added successfully
                this.modalController.dismiss();
  
                // Reset the form after successful submission
                this.formData = {
                  student_name: this.navParams.get('userName'),
                  document_type: this.selectedDocumentTypes.join(', '),
                  status: 'Pending',
                  doc_status: 'New',
                  payment: 'Not Paid',
                  student_id: this.navParams.get('userId'),
                  email: this.navParams.get('userEmail'),
                  Status: this.navParams.get('Status'),
                  lrn: this.navParams.get('lrn'),
                  contact_no: this.navParams.get('contact_no'),
                  year_level: 'n/a',
                  strand: 'n/a',
                  remarks: this.navParams.get('remarks'),
                  request_date: formattedDate,
                  comment: ' ',
                  comments: ' ',
                };
  
                //const emailSubject = `There is a new ${this.formData.document_type} request from ${this.formData.email}`;
                //this.emailService.sendEmail('90.002.snfss@gmail.com', emailSubject, this.formData.email);
                //this.emailService.sendEmail('90.003.snfss@gmail.com', emailSubject, this.formData.email);
  
                window.alert('A reference code for your request has been sent to you email, kindly await updates and check your emails.');
              } catch (error) {
                // Request failed to add
                console.error('Error adding request:', error);
                window.alert('An error occurred while adding the request.');
              }
            }
          }
        ]
      });
  
      await alert.present();
    } catch (error) {
      // Handle unexpected errors
      console.error('Unexpected error in submitForm:', error);
      window.alert('An unexpected error occurred. Please try again.');
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
            this.formData.remarks = this.userData.
            this.formData.comment = this.userData.comment
            this.formData.comments = this.userData.comments

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