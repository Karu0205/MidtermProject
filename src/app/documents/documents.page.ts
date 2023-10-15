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

      } else {
        // User is not logged in
        this.isLoggedIn = false;
        this.userId = null;
        this.userName = null;

      }
    });
  }

  logOut(){
    this.dataService.logout();
    this.router.navigate(['/login'])

    this.afAuth.signOut().then(() => {
      // Handle successful logout (e.g., navigate to login page).
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  }

  openForm(){
    this.router.navigate(['/form'])
  }

  toProfile(){
    this.router.navigate(['/profile'])
  }

  toNotif(){
    this.router.navigate(['/notifications'])
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
          name: 'email',
          value: this.userData.email,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, email: req.email, student_id: req.student_id});
            this.setOpen(true);
          }
        }
      ]
    });
    await alert.present(); 
  }
  
  async addESC(){
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
          value: 'ESC Certificate',
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
          name: 'email',
          value: this.userData.email,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, email: req.email, student_id: req.student_id});
            this.setOpen(true);
          }
        }
      ]
    });
    await alert.present(); 
  }

  async addCompletion(){
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
          value: 'Certificate of Completion',
          type: 'text',
          disabled: true
        },
        {
          name: 'email',
          value: this.userData.email,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, email: req.email, student_id: req.student_id});
            this.setOpen(true);
          }
        }
      ]
    });
    await alert.present(); 
  }

  async addGoodMoral(){
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
          value: 'Certificate of Good Moral',
          type: 'text',
          disabled: true
        },
        {
          name: 'email',
          value: this.userData.email,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, email: req.email, student_id: req.student_id});
            this.setOpen(true);
          }
        }
      ]
    });
    await alert.present(); 
  }

  async addEnrollment(){
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
          value: 'Certificate of Enrollment',
          type: 'text',
          disabled: true
        },
        {
          name: 'email',
          value: this.userData.email,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, email: req.email, student_id: req.student_id});
            this.setOpen(true);
          }
        }
      ]
    });
    await alert.present(); 
  }

  async addTranscript(){
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
          value: 'Certificate of Ranking',
          type: 'text',
          disabled: true
        },
        {
          name: 'email',
          value: this.userData.email,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, email: req.email, student_id: req.student_id});
            this.setOpen(true);
          }
        }
      ]
    });
    await alert.present(); 
  }

  async addCEMI(){
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
          value: 'Certificate of English as Medium of Instruction',
          type: 'text',
          disabled: true
        },
        {
          name: 'email',
          value: this.userData.email,
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
            this.dataService.addRequest({student_name: req.student_name, document_type: req.document_type, status: req.status, email: req.email, student_id: req.student_id});
            this.setOpen(true);
          }
        }
      ]
    });
    await alert.present(); 
  }

  

}


