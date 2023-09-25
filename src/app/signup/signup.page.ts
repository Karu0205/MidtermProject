import { Component, OnInit } from '@angular/core';
import { Account, FirebaseService } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';


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

  accounts: Account[] = []; 
  requests: Request[] = []; 


  constructor(public fireService:FirebaseService, public firestore: AngularFirestore, 
    private afAuth: AngularFireAuth, private router: Router) { 
      this.fireService.getAccounts().subscribe(res => {
        console.log(res);
        this.accounts=res;
      })
    }

  ngOnInit() {
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


}
