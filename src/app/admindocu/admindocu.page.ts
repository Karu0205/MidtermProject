import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admindocu',
  templateUrl: './admindocu.page.html',
  styleUrls: ['./admindocu.page.scss'],
})
export class AdmindocuPage implements OnInit {
  accounts = [] as any;

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController) {
    this.dataService.getAccounts().subscribe(res => {
      console.log(res);
      this.accounts=res;
    })
   }

  ngOnInit() {
  }

  accountList(){

  }

  async addAccount(){
    const alert = await this.alertCtrl.create({
      header: 'Add Account',
      inputs: [
        {
          name: 'Student Id',
          placeholder: 'Enter Id',
          type: 'text'
        },

        {
          name:'Name of Student ',
          placeholder: 'Enter Name Of student',
          type: 'text'
        },
        {
          name: 'Password of Student',
          placeholder: 'Enter student password',
          type: 'text'
        }
      ],
      buttons:[
        
      ]
    })
  }

}
