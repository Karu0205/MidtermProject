import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage{
  userId: any;
  isLoggedIn: boolean;
  userName: any;
  userEmail: any;

  isAlertOpen = false;
  public alertButtons = ['OK'];

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  requests = [] as any; 
  userData: any;

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController, private route: ActivatedRoute,
    private afAuth: AngularFireAuth, private firestore: AngularFirestore ) {
      
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

  ngOnInit(){
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.firestore
        .collection('users')
        .doc(user.uid)
        .valueChanges()
        .subscribe((data) => {
          this.userData = data;
        });
        // User is logged in
        this.isLoggedIn = true;
        this.userId = user.uid; // Retrieve the user ID
        this.userEmail = user.email;
        this.userName = user.displayName// Retrieve the user name
        console.log('User ID:', this.userId);
        console.log('User Email:', this.userEmail);
        console.log('User Name:', this.userName);
      } else {
        // User is not logged in
        this.isLoggedIn = false;
        this.userId = null;
        this.userName = null;

      }
    });
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
      header: 'Confirm Request?',
      inputs: [
        {
          name: 'student_name',
          value: this.userData.displayName,
          type: 'text',
          disabled: true
        },

        {
          name:'document_type',
          value: 'Form 137',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Pending',
          type: 'text',
          disabled: true
        },
        {
          name: 'student_id',
          value: this.userData.uid,
          type: 'text',
          disabled: true,
          cssClass: 'invisible-input',
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
            this.setOpen(true);
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
          value: this.userData.displayName,
          type: 'text',
          disabled: true
        },

        {
          name:'document_type',
          value: 'Form 138',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Pending',
          type: 'text',
          disabled: true
        },
        {
          name: 'student_id',
          value: this.userData.uid,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, student_id: req.student_id});
            this.setOpen(true);
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
          value: this.userData.displayName,
          type: 'text',
          disabled: true
        },

        {
          name:'document_type',
          value: 'Certificate of Completion',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Pending',
          type: 'text',
          disabled: true
        },
        {
          name: 'student_id',
          value: this.userData.uid,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, student_id: req.student_id});
            this.setOpen(true);
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
          value: this.userData.displayName,
          type: 'text',
          disabled: true
        },

        {
          name:'document_type',
          value: 'Certificate of Good Moral',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Pending',
          type: 'text',
          disabled: true
        },
        {
          name: 'student_id',
          value: this.userData.uid,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, student_id: req.student_id});
            this.setOpen(true);
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
          value: this.userData.displayName,
          type: 'text',
          disabled: true
        },

        {
          name:'document_type',
          value: 'Enrollment Form',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Pending',
          type: 'text',
          disabled: true
        },
        {
          name: 'student_id',
          value: this.userData.uid,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, student_id: req.student_id});
            this.setOpen(true);
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
          value: this.userData.displayName,
          type: 'text',
          disabled: true
        },

        {
          name:'document_type',
          value: 'Transcript of Records',
          type: 'text',
          disabled: true
        },
        {
          name: 'status',
          value: 'Pending',
          type: 'text',
          disabled: true
        },
        {
          name: 'student_id',
          value: this.userData.uid,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, student_id: req.student_id});
            this.setOpen(true);
          }
        }
      ]
    });
    await alert.present(); 
  }

  

}


