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
  items: any[];
  searchText: string;
  

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
    this.dataService.getItems().subscribe((requests) => {
      console.log(requests)
      this.requests = requests;
    });
  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  searchItems() {

    console.log('SearchItems method called');
    console.log('Search Text:', this.searchText);
    if (!this.searchText) {
      // If the search text is empty, display all items.
      this.dataService.getItems().subscribe((requests) => {
        this.requests = requests;
      });
    } else {
      // If there is a search text, filter items based on it.
      this.dataService.getItems().subscribe((requests) => {
        this.requests = requests.filter((requests) => {
          return (
            requests.student_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
            requests.status.toLowerCase().includes(this.searchText.toLowerCase()) ||
            requests.document_type.toLowerCase().includes(this.searchText.toLowerCase())
          );
        });
      });
    }
  }
  

  async initializeItems(): Promise<any> {
    const requests = await this.firestore.collection('requests').valueChanges().pipe(first()).toPromise();
    return requests;
  }

  async filterList(event) {
    //this.requests = await this.initializeItems();
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

  openRegister(){
    this.router.navigate(['/signup'])
  }

  openStorage(){
    this.router.navigate(['/storage'])
  }
  
  editItem(id: string, newData: any) {
    this.dataService.updateItem(id, newData)
      .then(() => {
        console.log('Item updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating item:', error);
      });
  }

  async deleteItem(id: string) {
    const confirmationAlert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            // User confirmed deletion, proceed with delete operation.
            this.dataService
              .deleteItem(id)
              .then(() => {
                console.log('Item deleted successfully.');
                // Remove the deleted item from the local array to update the UI.
                this.requests = this.requests.filter((requests) => requests.id !== id);
              })
              .catch((error) => {
                console.error('Error deleting item:', error);
              });
          },
        },
      ],
    });
  
    await confirmationAlert.present();
  }

  





}
