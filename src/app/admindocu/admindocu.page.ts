import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admindocu',
  templateUrl: './admindocu.page.html',
  styleUrls: ['./admindocu.page.scss'],
})
export class AdmindocuPage implements OnInit {
  accounts = [] as any;

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router ) {
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
          name: 'student_id',
          placeholder: 'Enter Id',
          type: 'text'
        },

        {
          name:'student_username',
          placeholder: 'Enter Name Of student',
          type: 'text'
        },
        {
          name: 'student_password',
          placeholder: 'Enter student password',
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
          handler: (res) => {
            this.dataService.addAccount({student_id: res.student_id, student_username: res.student_username, student_password: res.student_password})
          }
        }
      ]
    });
    await alert.present(); 
  }

  logOut(){
    this.router.navigate(['/login'])
  }

  openDocu(){
    this.router.navigate(['/documents'])
  }

}
