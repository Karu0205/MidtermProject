import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalPage } from '../modal/modal.page';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admindocu',
  templateUrl: './admindocu.page.html',
  styleUrls: ['./admindocu.page.scss'],
})
export class AdmindocuPage implements OnInit {
  accounts = [] as any;
  requests = [] as any; 

  results = [this.requests];

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


  async openAccount(account: any){
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { student_id: account.student_id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5
    });
    modal.present();
  }

  async addRequest(){
    const alert = await this.alertCtrl.create({
      header: 'Add Request',
      inputs: [
        {
          name: 'student_name',
          placeholder: 'Enter Name',
          type: 'text'
        },

        {
          name:'document_type',
          placeholder: 'Enter Document Type',
          type: 'text'
        },
        {
          name: 'status',
          placeholder: 'enter status',
          type: 'text'
        }
      ],
      buttons:[
        {
          text: 'Cancel',
          role : 'cancel',
        },
        {
          text: 'Add',
          handler: (req) => {
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status});
          }
        }
      ]
    });
    await alert.present(); 
  }

  logOut(){
    this.router.navigate(['/adminlogin'])
  }

  openDocu(){
    this.router.navigate(['/documents'])
  }

}
