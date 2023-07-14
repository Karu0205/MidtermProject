import { Component, OnInit } from '@angular/core';
import { FirebaseService, Request } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  accounts = [] as any;
  requests: Request[] = []; 

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController ) {
      this.dataService.getAccounts().subscribe(res => {
        console.log(res);
        this.accounts=res;
      })
     }

  ngOnInit() {
  }

  accountList(){

  }

  logOut(){
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

}
