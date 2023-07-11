import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage{

  requests = [] as any; 

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController ) {
      
    this.dataService.getRequests().subscribe(req => {
      console.log(req);
      this.requests=req;

    })
    }

  public data = [
    'Form 137',
    'Form 138',
    'Certificate of Completion',
    'Certificate of Good Moral',
    'Enrollment Form',
    'Transcript of Records',
  ];
  public results = [...this.data];

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter((d) => d.toLowerCase().indexOf(query) > -1);
  }

  logOut(){
    this.router.navigate(['/login'])
  }

  openForm(){
    this.router.navigate(['/form'])
  }

  toProfile(){
    this.router.navigate(['/profile'])
  }

  async add137(){
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
  
  async add138(){
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
          value: 'Form 138',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Ongoing',
          type: 'text',
          disabled: true
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

  async addCompletion(){
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
          value: 'Certificate of Completion',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Ongoing',
          type: 'text',
          disabled: true
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

  async addGoodMoral(){
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
          value: 'Certificate of Good Moral',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Ongoing',
          type: 'text',
          disabled: true
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

  async addEnrollment(){
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
          value: 'Enrollment Form',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Ongoing',
          type: 'text',
          disabled: true
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

  async addTranscript(){
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
          value: 'Transcript of Records',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Ongoing',
          type: 'text',
          disabled: true
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

}


