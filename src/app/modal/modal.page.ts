import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Request, FirebaseService } from '../service/firebase.service';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})

export class ModalPage implements OnInit {
  @Input() id: string;
  request: Request = null!;
  requests: Request[] = []; 

  constructor(private dataService: FirebaseService, private modalCtrl: ModalController, private toastCtrl: ToastController,
    private alertCtrl: AlertController) { 
    this.dataService.getRequests().subscribe(req => {
      console.log(req);
      this.requests=req;
    })
  }

  ngOnInit() {
    this.dataService.getRequestById(this.id).subscribe(req => {
      this.request = req;
      console.log(req);
    });
  }
  

  async deleteRequest() {
    await this.dataService.deleteRequest(this.request!)
    this.modalCtrl.dismiss();
  }

  async updateRequest() {
    await this.dataService.updateRequest(this.request!);
    const toast = await this.toastCtrl.create({
      message: 'Status updated!.',
      duration: 2000
    });
    toast.present();

  }
  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
      
    },
  ];
}