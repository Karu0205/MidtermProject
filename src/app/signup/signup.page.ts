import { Component, OnInit, ViewChild } from '@angular/core';
import { Account, FirebaseService } from '../service/firebase.service';
import { AlertController, IonInput, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EmailService } from '../email.service';


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
  public uid: any;

  accounts: Account[] = []; 
  requests: Request[] = []; 

  copiedText: string = '';
  @ViewChild('textInput', { static: false }) textInput: IonInput;
  fromName: string;
  initialFromName: string;

  toEmail: string = '';
  subject: string = '';
  message: string = '';

  copyText(text: string) {
    this.copiedText = text;
    this.textInput.value = text;
  }


  constructor(public fireService:FirebaseService, public firestore: AngularFirestore, 
    private afAuth: AngularFireAuth, private router: Router, private emailService: EmailService,
    private modalCtrl:ModalController) { 
      this.fireService.getAccounts().subscribe(res => {
        console.log(res);
        this.accounts=res;
      })
      
      this.fromName = 'Sto. Nino Formation and Science School'; // Set this to the default value
      this.initialFromName = this.fromName;
    }

  ngOnInit() {
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


    signup(){ 
    this.fireService.signup({email:this.email,password:this.password}).then(res=>{
      if(res.user!.uid){
        let data = {
          email:this.email,
          password:this.password,
          displayName:this.displayName,
          isAdmin:this.isAdmin,
          uid:res.user!.uid
        }
        this.fireService.saveDetails(data).then(res=>{
         alert('Account Created!');
        },err=>{
          console.log(err);
        })
        this.emailService.sendEmail2(this.email, 'Your account has been created with the following password: ' + this.password, 'Sto. Nino Formation and Science School');
      }
    },err=>{
      alert(err.message);

      console.log(err);
    })
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



}
