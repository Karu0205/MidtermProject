import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../service/firebase.service';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {

  contents: any[] = [];
  filteredContents: any[] = [];
  searchTerm: string = '';

  constructor(private modalController: ModalController, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getContents().subscribe((data) => {
      console.log('Fetched data:', data);
      this.contents = data;
      this.filteredContents = [...this.contents];
    });
  }
  filterContents() {
    if (this.searchTerm.trim() === '') {
      this.filteredContents = [...this.contents];
    } else {
      this.filteredContents = this.contents.filter((content) =>
        content.student_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        content.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        content.document_type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        content.request_date.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }


  async openEditModal(content: any) {
    if (!content) {
      console.error('Content is undefined or null');
      return;
    }
  
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: { content },
    });
    await modal.present();
  
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        // Your update logic here
      }
    });
  }

}
