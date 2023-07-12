import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { InfiniteScrollCustomEvent } from '@ionic/angular';


@Component({
  selector: 'app-admindocu',
  templateUrl: './admindocu.page.html',
  styleUrls: ['./admindocu.page.scss'],
})
export class AdmindocuPage implements OnInit {


  private generateItems() {
    const count = this.requests.length + 1;
    for (let i = 0; i < 50; i++) {
      this.requests.push(`Item ${count + i}`);
    }
  }

  onIonInfinite(ev: any) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

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
