import { Component, OnInit } from '@angular/core';
import { FirebaseService, Request } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';


@Component({
  selector: 'app-admindocu',
  templateUrl: './admindocu.page.html',
  styleUrls: ['./admindocu.page.scss'],
})
export class AdmindocuPage implements OnInit {

  accounts = [] as any;
  requests: Request[] = []; 

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController ) {
    this.dataService.getAccounts().subscribe(res => {
      console.log(res);
      this.accounts=res;
    })

    this.dataService.getRequests().subscribe(req => {
      console.log(req);
      this.requests=req;
    })

   }

  ngOnInit() {
  }

  accountList(){

  }

  requestList(){

  }

  async openRequest(request: Request){
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { id: request.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5
    });
    modal.present();
  }

  logOut(){
    this.router.navigate(['/adminlogin'])
  }

  openDocu(){
    this.router.navigate(['/documents'])
  }



}
