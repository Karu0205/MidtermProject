import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.page.html',
  styleUrls: ['./resetpass.page.scss'],
})
export class ResetpassPage {

  email: string = '';

  constructor(private afAuth: AngularFireAuth, private navCtrl: NavController) { }

  async sendResetEmail() {
    try {
      await this.afAuth.sendPasswordResetEmail(this.email);
      console.log("Email sent successfully");
      window.alert("Email sent successfully");
    } catch (error) {
      // Handle errors here (e.g., display an error message).
      console.error('Error sending reset email:', error);
      window.alert('Error sending reset email');
    }
  }

}
