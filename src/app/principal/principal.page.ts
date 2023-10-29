import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Request, FirebaseService } from '../service/firebase.service';
import { EmailService } from '../email.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  private subscription: Subscription;
  @Input() id: string;
  request: Request = null!;
  requests: Request[] = []; 
  approval = [] as any;

  notificationCount2 = 0; // Initialize count
  constructor(private dataService: FirebaseService, private modalCtrl: ModalController, private toastCtrl: ToastController,
    private alertCtrl: AlertController, private emailService:EmailService, private firestore: AngularFirestore) { 
    this.dataService.getRequests().subscribe(req => {
      console.log(req);
      this.requests=req;
    })

    this.notificationsCollection2 = this.firestore.collection('notifications2');

    this.subscription = this.notificationsCollection2.valueChanges().subscribe((data) => {
      this.notificationCount2 = data.length;
    });
  }

  ngOnInit() {
    this.dataService.getRequestById(this.id).subscribe(req => {
      this.request = req;
      console.log(req);
    });

    this.dataService.getApproval().subscribe((approval) => {
      this.approval = approval;
      console.log(approval)
    });
  }

  
  async closeModal() {
    await this.modalCtrl.dismiss();
  }
  

  async deleteRequest() {
    await this.dataService.deleteRequest(this.request!)
    this.modalCtrl.dismiss();
  }

  async deleteApproval() {
    await this.dataService.deleteApproval(this.request)
    this.modalCtrl.dismiss();
  }


  async forApproval(){
    await this.dataService.addApproval(this.request!);
    this.addNotification2()
  }

  async updateRequest() {
    await this.dataService.updateRequest(this.request!);
    const toast = await this.toastCtrl.create({
      message: 'Status updated!.',
      duration: 2000
    });
    toast.present();
  
    // Display a confirmation dialog and send an email when the user confirms
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Do you want to send an email notification?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            // Send an email using this.emailService.sendEmail2
            this.emailService.sendEmail(
              this.request.email,
              'Your ' + this.request.document_type + ' request has been updated with this status: ' + this.request.status,
              'Sto. Nino Formation and Science School'
            );
          },
        },
      ],
    });
  
    await alert.present();
  }

  async onStatusChange() {
    if (this.request.status === 'Completed') {
      const alert = await this.alertCtrl.create({
        header: 'Confirmation',
        message: 'Are you sure the request is complete?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: 'Yes',
            handler: () => {
              this.deleteRequest(); // Call the deleteRequest function if the user confirms
              this.dataService.addCompleted(this.request)
              this.showToast('Request marked as completed.'); // Display a toast notification
            },
          },
        ],
      });
  
      await alert.present();
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000, // Duration in milliseconds
    });
    toast.present();
  }

  notificationsCollection2 = this.firestore.collection('notifications2');
  addNotification2() {
    this.notificationsCollection2.add({ /* your data */ }).then(() => {
      this.notificationCount2++; // Increment the count
    });
  }
}
