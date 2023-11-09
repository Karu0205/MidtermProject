import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    private firestore: AngularFirestore) { }

  ngOnInit() {
    this.firestore.collection('account_request').valueChanges().subscribe((data: any[]) => {
      this.accountRequests = data;
    });
  }

  async submitRequest() {
    const newRequest = {
      fullName: this.fullName,
      email: this.email,
      lrn: this.lrn,
      enrollmentDate: this.enrollmentDate,
      graduationDate: this.graduationDate,
      accountStatus: this.accountStatus,
    };

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
  }

  // Function to handle image file selection
  handleImageUpload(event: any) {
    this.imageFile = event.target.files[0];
  }
}

