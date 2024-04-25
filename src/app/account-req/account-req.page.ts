import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-account-req',
  templateUrl: './account-req.page.html',
  styleUrls: ['./account-req.page.scss'],
})
export class AccountReqPage implements OnInit {

  fullName: string;
  email: string;
  lrn: string;
  enrollmentDate: string;
  graduationDate: string;
  accountStatus: string = 'new';
  imageFile: any; // Variable to store the selected image file
  accountRequests: any[] = [];


  constructor(    private storage: AngularFireStorage,
    private firestore: AngularFirestore, private alertController: AlertController,
    private modalCrtl:ModalController) { }

  ngOnInit() {
    this.firestore.collection('account_request').valueChanges().subscribe((data: any[]) => {
      this.accountRequests = data;
    });
  }

  notificationCount = 0; // Initialize count

  notificationsCollection = this.firestore.collection('notifications');

  addNotification() {
    this.notificationsCollection.add({ /* your data */ }).then(() => {
      this.notificationCount++; // Increment the count
    });
  }

  async submitRequest() {
    // Check if there is already an account request with the same email
    const existingRequest = this.accountRequests.find(request => request.email === this.email);
  
    if (existingRequest) {
      // Show an alert indicating that an account request with the same email already exists
      this.presentAlert('Error', 'An account request with the same email already exists.');
      return; // Exit the function to prevent further execution
    }
  
    const newRequest = {
      fullName: this.fullName,
      email: this.email,
      lrn: this.lrn,
      enrollmentDate: this.enrollmentDate,
      ...(this.graduationDate && { graduationDate: this.graduationDate }),
      accountStatus: this.accountStatus,
    };
  
    try {
      // Add the request to Firebase
      const docRef = await this.firestore.collection('account_request').add(newRequest);
  
      // Upload image to Firebase Storage
      if (this.imageFile) {
        const filePath = `images/${docRef.id}`;
        await this.storage.upload(filePath, this.imageFile);
  
        // Get the image URL after upload
        const downloadURL$ = this.storage.ref(filePath).getDownloadURL();
  
        // Subscribe to get the actual download URL
        downloadURL$.subscribe((downloadURL) => {
          // Update the document with the image URL
          this.firestore.collection('account_request').doc(docRef.id).update({
            imageUrl: downloadURL,
          });
        });
      }
  
      // Reset form fields
      this.fullName = '';
      this.email = '';
      this.lrn = '';
      this.enrollmentDate = '';
      this.graduationDate = '';
      this.imageFile = null;
  
      // Show success 
      this.addNotification();
      this.presentAlert('Success', 'Account request successful! Kindly await an email for your account');
      this.closeModal();
      
    } catch (error) {
      // Show error alert
      this.presentAlert('Error', 'An error occurred. Double-check your details and try again.');
      console.error('Error submitting account request:', error);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Function to handle image file selection
  handleImageUpload(event: any) {
    this.imageFile = event.target.files[0];
  }

  async closeModal() {
    await this.modalCrtl.dismiss();
  }


  onInput(event: any) {
    // Remove non-numeric characters using a regular expression
    this.lrn = event.target.value.replace(/[^0-9]/g, '');
  }
}

