import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { StoragePage } from '../storage/storage.page';
import { EscPage } from '../esc/esc.page';
import { GoodmoralPage } from '../goodmoral/goodmoral.page';
import { CompletionPage } from '../completion/completion.page';
import { EnrollmentPage } from '../enrollment/enrollment.page';
import { RankingPage } from '../ranking/ranking.page';
import { CemiPage } from '../cemi/cemi.page';

@Component({
  selector: 'app-storage-menu',
  templateUrl: './storage-menu.page.html',
  styleUrls: ['./storage-menu.page.scss'],
})
export class StorageMenuPage implements OnInit {

  constructor(private router: Router, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  logOut(){
    this.router.navigate(['/adminlogin'])
  }

  openDocu(){
    this.router.navigate(['/admindocu'])
  }

  openRegister(){
    this.router.navigate(['/signup'])
  }

  openStorage(){
    this.router.navigate(['/storage'])
  }

  form137(){
    this.router.navigate(['/storage'])
  }

  ESC(){
    this.router.navigate(['/esc'])
  }

  goodmoral(){
    this.router.navigate(['/goodmoral'])
  }

  completion(){
    this.router.navigate(['/completion'])
  }

  enrollment(){
    this.router.navigate(['/enrollment'])
  }

  ranking(){
    this.router.navigate(['/ranking'])
  }

  cemi(){
    this.router.navigate(['/cemi'])
  }

  transcript(){
    this.router.navigate(['/transcript'])
  }
  
  openCalendar(){
    this.router.navigate(['/calendar'])
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  async open137Modal() {
    const modal = await this.modalCtrl.create({
      component: StoragePage, // Use your form component here
    });

    return await modal.present();
  }

  async openESCModal() {
    const modal = await this.modalCtrl.create({
      component: EscPage, // Use your form component here
    });

    return await modal.present();
  }

  async openGoodMoralModal() {
    const modal = await this.modalCtrl.create({
      component: GoodmoralPage, // Use your form component here
    });

    return await modal.present();
  }

  async openCompletionModal() {
    const modal = await this.modalCtrl.create({
      component: CompletionPage, // Use your form component here
    });

    return await modal.present();
  }

  async openEnrollmentModal() {
    const modal = await this.modalCtrl.create({
      component: EnrollmentPage, // Use your form component here
    });

    return await modal.present();
  }

  async openRankingModal() {
    const modal = await this.modalCtrl.create({
      component: RankingPage, // Use your form component here
    });

    return await modal.present();
  }

  async openCEMIModal() {
    const modal = await this.modalCtrl.create({
      component: CemiPage, // Use your form component here
    });

    return await modal.present();
  }
}
