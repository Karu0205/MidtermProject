import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
  requests = [] as any; 
  userData: any;

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController ) {

    this.dataService.getRequests().subscribe(req => {
      console.log(req);
      this.requests=req;
    })

   }

  ngOnInit() {
  }

  logOut(){
    this.router.navigate(['/login'])
  }

  toDocuments(){
    this.router.navigate(['/documents'])
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
          value: 'Form 137',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Ongoing',
          type: 'text',
          disabled: true
        },
        {
          name: 'student_id',
          value: this.userData.uid,
          type: 'text',
          disabled: true,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, student_id: req.student_id});
          }
        }
      ]
    });
    await alert.present(); 
  }

}
