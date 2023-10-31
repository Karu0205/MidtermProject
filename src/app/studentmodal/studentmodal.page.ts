import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-studentmodal',
  templateUrl: './studentmodal.page.html',
  styleUrls: ['./studentmodal.page.scss'],
})
export class StudentmodalPage implements OnInit {
  @Input() uid: string;
  user: any;

  constructor(private modalCtrl: ModalController, private firestore: AngularFirestore, private dataService:FirebaseService) {

  }

  ngOnInit() {
    this.firestore.collection('users').doc(this.uid).valueChanges()
    .subscribe((user: any) => {
      this.user = user;
    });
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  // Implement the logic to update user data in Firebase
  saveChanges() {
    this.firestore.collection('users').doc(this.uid).update(this.user);
    this.closeModal();
  }

}
