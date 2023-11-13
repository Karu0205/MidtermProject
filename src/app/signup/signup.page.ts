import { Component, OnInit, ViewChild } from '@angular/core';
import { Account, FirebaseService } from '../service/firebase.service';
import { AlertController, IonInput, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EmailService } from '../email.service';
import { EditstudentPage } from '../editstudent/editstudent.page';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public email:any;
  public password:any;
  public displayName:any;
  public isAdmin: any;
  public Status: any;
  public uid: any;
  public lrn: any;

  accounts: Account[] = []; 
  requests: Request[] = []; 

  copiedText: string = '';
  @ViewChild('textInput', { static: false }) textInput: IonInput;
  fromName: string;
  initialFromName: string;

  toEmail: string = '';
  subject: string = '';
  message: string = '';
  showPassword: boolean = false

  accountRequests: any[] = [];

  copyText(text: string) {
    this.copiedText = text;
    this.textInput.value = text;
  }


  constructor(public fireService:FirebaseService, public firestore: AngularFirestore, 
    private afAuth: AngularFireAuth, private router: Router, private emailService: EmailService,
    private modalCtrl:ModalController, private alertController:AlertController) { 
      this.fireService.getAccounts().subscribe(res => {
        console.log(res);
        this.accounts=res;
      })
      
      this.fromName = 'Sto. Nino Formation and Science School'; // Set this to the default value
      this.initialFromName = this.fromName;
    }

  ngOnInit() {
    this.firestore.collection('account_request').valueChanges().subscribe((data: any[]) => {
      this.accountRequests = data;
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async initializeItems(): Promise<any> {
    const accounts = await this.firestore.collection('users').valueChanges().pipe(first()).toPromise();
    return accounts;
  }

  async filterList(event) {
    this.accounts = await this.initializeItems();
    const searchTerm = event.target.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.accounts = this.accounts.filter((accountUser) => {
      if (accountUser.displayName && searchTerm) {
        return (
          accountUser.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
          accountUser.password.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
          accountUser.email.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        );
      }
      return false; // Add a default return statement
    });
  }

  fillForm(user: any) {
    this.displayName = user.fullName;
    this.email = user.email;
    this.lrn = user.lrn;
    this.isAdmin = "false";
    this.Status = user.graduationDate ? 'Alumni' : 'Currently Enrolled';
    // Set other properties as needed
  }

  async presentAlert(request) {
    const alert = await this.alertController.create({
      header: 'Choose Action',
      message: 'Do you want to fill the form or delete?',
      buttons: [
        {
          text: 'Fill Form',
          handler: () => {
            this.fillForm(request);
          }
        },
        {
          text: 'Reject',
          handler: () => {
            this.deleteEntry(request);
          
          }
        }
      ]
    });

    await alert.present();
  }


  deleteEntry(request) {
    // Replace 'account_requests' with the actual collection name in your Firebase
    const collectionName = 'account_request';

    // Query the collection based on the 'email' field
    const query = this.firestore.collection(collectionName, ref => ref.where('email', '==', request.email));
    this.emailService.sendEmail2(request.email, 'Your account creation request has been rejected', 'Sto. Nino Formation and Science School');

    query.snapshotChanges().subscribe(data => {
      if (data.length > 0) {
        // Assuming there's only one document with the specified email (or you want to delete all matching documents)
        const docId = data[0].payload.doc.id;

        // Delete the document
        this.firestore.collection(collectionName).doc(docId).delete()
          .then(() => {
            console.log('Entry deleted successfully');

            // Remove the entry from the client-side array
            const index = this.accountRequests.indexOf(request);
            if (index > -1) {
              this.accountRequests.splice(index, 1);
            }
          })
          .catch(error => {
            console.error('Error deleting entry', error);
          });
      } else {
        console.log('No matching document found for deletion');
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  generatePassword() {
    // Generate a random password with letters and numbers
    const randomPassword = this.generateRandomString(10); // Change 10 to the desired length

    // Set the generated password to the component property
    this.password = randomPassword;
  }

  // Function to generate a random string with letters and numbers
  private generateRandomString(length: number): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }


  signup() {
    this.fireService.signup({ email: this.email, password: this.password }).then(res => {
      if (res.user!.uid) {
        let data: any = {
          email: this.email,
          password: this.password,
          displayName: this.displayName,
          isAdmin: this.isAdmin,
          lrn: this.lrn,
          uid: res.user!.uid,
        };
  
        // Check if Status is defined before adding it to the data object
        if (this.Status) {
          data.Status = this.Status;
        }
  
        this.fireService.saveDetails(data).then(res => {
          // Delete accountRequests entry with the same email
          this.deleteAccountRequestByEmail(this.email);
  
          alert('Account Created!');
        }, err => {
          console.log(err);
        });
  
        this.emailService.sendEmail2(this.email, 'Your account has been created with the following password: ' + this.password, 'Sto. Nino Formation and Science School');
      }
    }, err => {
      alert(err.message);
      console.log(err);
    });
  }
  
  // Function to delete accountRequests entry by email
  private deleteAccountRequestByEmail(email: string) {
    // Find the request with the specified email
    const requestToDelete = this.accountRequests.find(request => request.email === email);
  
    if (requestToDelete) {
      // Get the document ID from Firestore based on the email
      this.firestore.collection('account_request', ref => ref.where('email', '==', email))
        .get()
        .toPromise()
        .then(querySnapshot => {
          if (querySnapshot && !querySnapshot.empty) {
            const requestId = querySnapshot.docs[0].id;
  
            // Remove the entry from the local array
            this.accountRequests = this.accountRequests.filter(request => request.email !== email);
  
            // Update the Firestore collection by deleting the document
            this.firestore.collection('account_request').doc(requestId).delete().then(() => {
              console.log('account_request entry deleted successfully');
            }).catch(error => {
              console.error('Error deleting account_request entry:', error);
            });
          }
        })
        .catch(error => {
          console.error('Error querying account_request collection:', error);
        });
    }
  }
  
  

  

  logOut(){
    this.router.navigate(['/adminlogin'])
  }

  openDocu(){
    this.router.navigate(['/admindocu'])
  }

  openRegister(){
    this.router.navigate(['/signup'])
  }

  openStorage(){
    this.router.navigate(['/storage-menu'])
  }

  Home(){
    this.router.navigate(['/adminprofile'])
  }

  openCalendar(){
    this.router.navigate(['/calendar'])
  }

  sendEmail() {
    console.log("Value of this.toEmail before splitting:", this.toEmail);
    const emailAddresses = this.toEmail.split(',');
    console.log("Email addresses after splitting:", emailAddresses);
  
    this.emailService
      .sendEmail2(this.toEmail, this.message, this.fromName,)
      .then(() => {
        // Clear form fields or handle success as needed
        this.toEmail = '';
        this.message = '';
        this.fromName = '';
      })
      .catch((error) => {
        // Handle error as needed
        console.error(error);
      });
      console.log("Value of this.toEmail after sending:", this.toEmail);

  }

  async openAccountsModal() {
    const modal = await this.modalCtrl.create({
      component: EditstudentPage, // Use your form component here
    });

    return await modal.present();
  }



}
