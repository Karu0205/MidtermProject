import { Component, OnInit } from '@angular/core';
import { FirebaseService, Request } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-admindocu',
  templateUrl: './admindocu.page.html',
  styleUrls: ['./admindocu.page.scss'],
})
export class AdmindocuPage implements OnInit {

  accounts = [] as any;
  requests: Request[] = []; 
  

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController, private firestore: AngularFirestore ) {
    this.dataService.getAccounts().subscribe(res => {
      console.log(res);
      this.accounts=res;
    })

    this.dataService.getRequests().subscribe(req => {
      console.log(req);
      this.requests=req;
    })

   }

  ngOnInit() {
  }

  async initializeItems(): Promise<any> {
    const requests = await this.firestore.collection('requests').valueChanges().pipe(first()).toPromise();
    return requests;
  }

  async filterList(event) {
    this.requests = await this.initializeItems();
    const searchTerm = event.target.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.requests = this.requests.filter((currentReq) => {
      if (currentReq.student_name && searchTerm) {
        return (
          currentReq.student_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
          currentReq.status.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
          currentReq.document_type.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        );
      }
      return false; // Add a default return statement
    });
  }

  accountList(){

  }

  requestList(){

  }

  async openRequest(request: Request){
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { id: request.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5
    });
    modal.present();
  }

  logOut(){
    this.router.navigate(['/adminlogin'])
  }

  openDocu(){
    this.router.navigate(['/documents'])
  }



}
