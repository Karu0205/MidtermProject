import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService, Request } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { first } from 'rxjs/operators';
import { EmailService } from '../email.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-admindocu',
  templateUrl: './admindocu.page.html',
  styleUrls: ['./admindocu.page.scss'],
})
export class AdmindocuPage implements OnInit {

  copiedText: string = '';
  @ViewChild('textInput', { static: false }) textInput: IonInput;
  fromName: string;
  initialFromName: string;

  toEmail: string = '';
  subject: string = '';
  message: string = '';

  selectedDocumentTypeFilter: string = '';
  selectedStrandFilter: string = '';
  selectedStatusFilter: string = '';
  selectedNewFilter: string = '';

  documentTypeFilterText: string = '';
strandFilterText: string = '';

  showPassword: boolean = false;
  
  accounts = [] as any;
  requests: Request[] = []; 
  items: any[];
  searchText: string;
  progressBarValue: number;

  selectedDocumentType: string = "";
  
  copyText(text: string) {
    this.copiedText = text;
    this.textInput.value = text;
  }

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController, private firestore: AngularFirestore,
    private emailService: EmailService ) {

      this.fromName = 'Sto. Nino Formation and Science School'; // Set this to the default value
      this.initialFromName = this.fromName;

    this.dataService.getAccounts().subscribe(res => {

      this.accounts=res;
    })

    this.dataService.getRequests().subscribe(req => {
      this.requests = req.sort((a, b) => new Date(b.request_date).getTime() - new Date(a.request_date).getTime());
    });
    

   }

  ngOnInit() {
    //this.dataService.getItems().subscribe(requests => {
      //this.requests = requests.sort((a, b) => {
        //const dateA = new Date(a.request_date).getTime();
        //const dateB = new Date(b.request_date).getTime();
    
        //return dateB - dateA; // Sort from newest to oldest, for oldest to newest, swap dateA and dateB.
      //});
    //}); 
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  sendEmail() {
    console.log("Value of this.toEmail before splitting:", this.toEmail);
    const emailAddresses = this.toEmail.split(',');
    console.log("Email addresses after splitting:", emailAddresses);
  
    this.emailService
      .sendEmail(this.toEmail, this.message, this.fromName,)
      .then(() => {
        // Clear form fields or handle success as needed
        this.toEmail = '';
        this.message = '';
        this.fromName = '';
      })
      .catch((error) => {
        // Handle error as needed
        console.error(error);
      });
      console.log("Value of this.toEmail after sending:", this.toEmail);

  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  searchItems() {
    console.log('SearchItems method called');
  
    if (!this.searchText) {
      // If the search text is empty, display all items and sort them.
      this.dataService.getItems().subscribe((requests) => {
        this.requests = requests;
        this.sortRequests();
        console.log('All items sorted:', this.requests); // Log the items retrieved
      });
    } else {
      // If there is a search text, filter items based on it.
      this.dataService.getItems().subscribe((requests) => {
        const filteredRequests = requests.filter((request) => {
          const searchTextLower = this.searchText.toLowerCase();
          const match =
            request.student_name.toLowerCase().includes(searchTextLower) ||
            request.status.toLowerCase().includes(searchTextLower) ||
            request.request_date.toLowerCase().includes(searchTextLower) ||
            request.document_type.toLowerCase().includes(searchTextLower);
          return match;
        });
        this.requests = filteredRequests;
        console.log('Filtered items:', this.requests); // Log the filtered items
      });
    }
  }
  onSearchTextChange() {
    this.applySearchFilter();
    this.applyFilters();
  }
  

  applyFilters() {
    // Filter based on dropdown filters (document_type and strand)
    this.dataService.getItems().subscribe((requests) => {
      this.requests = requests.filter((request) => {
        const documentTypeFilterMatch = this.selectedDocumentTypeFilter === '' || request.document_type === this.selectedDocumentTypeFilter;
        const strandFilterMatch = this.selectedStrandFilter === '' || request.strand === this.selectedStrandFilter;
        const StatusFilterMatch = this.selectedStatusFilter === '' || request.Status === this.selectedStatusFilter;
        const StatusNewMatch = this.selectedNewFilter === '' || request.doc_status === this.selectedNewFilter;
  
        return documentTypeFilterMatch && strandFilterMatch && StatusFilterMatch && StatusNewMatch;
      });
      this.applySearchFilter();
    });
  }
  
  applySearchFilter() {
    // Apply the search bar filter in the filtered requests
    const searchTextLower = this.searchText.toLowerCase();
    this.requests = this.requests.filter((request) =>
      request.student_name.toLowerCase().includes(searchTextLower) ||
      request.request_date.toLowerCase().includes(searchTextLower) ||
      request.lrn.toLowerCase().includes(searchTextLower) ||
      request.document_type.toLowerCase().includes(searchTextLower) ||
      request.req_id?.toLowerCase().includes(searchTextLower) ||
      request.status.toLowerCase().includes(searchTextLower)
    );
    this.sortRequests();
  }
  
  
  
  sortRequests() {
    // Sort the requests by request_date in descending order (newest to oldest).
    this.requests = this.requests.sort((a, b) => {
      const dateA = new Date(a.request_date).getTime();
      const dateB = new Date(b.request_date).getTime();
      return dateB - dateA;
    });
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
    });
    modal.present();
  }

  logOut(){
    this.dataService.logout();
    this.router.navigate(['/adminlogin'])
  }

  openDocu(){
    this.router.navigate(['/documents'])
  }

  openRegister(){
    this.router.navigate(['/signup'])
  }

  openStorage(){
    this.router.navigate(['/storage-menu'])
  }

  openCalendar(){
    this.router.navigate(['/calendar'])
  }

  editItem(id: string, newData: any) {
    // First, update the item in the existing collection
    console.log('Editing item with ID:', id);
    this.dataService.updateItem(id, newData)
      .then(() => {
        console.log('Item updated successfully.');
  
        // After successful update, re-fetch the data to reflect the changes
        this.dataService.getItems().subscribe((requests) => {
          this.requests = requests;
          console.log('Data reloaded after edit:', this.requests);
        });
  
        // Add the updated data to the "logs" collection
        const logData = {
          itemId: id,
          updatedData: newData,
          timestamp: new Date() // This captures the current timestamp
        };
  
        // Use AngularFire to add data to the "logs" collection
        this.firestore.collection('logs').add(logData)
          .then(() => {
            console.log('Log added successfully.');
          })
          .catch((error) => {
            console.error('Error adding log:', error);
          });
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

  
  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  calculateProgress(status: string): number {
    if (!status) {
      return 0; // or some default value if status is undefined
    }
  
    if (status.includes('Pending')) {
      return 15;
    } else if (status.includes('Request being handled by: ')) {
      return 30;
    } else if (status.includes('Accepted at the Registrar\'s Office by: ')) {
      return 30;
    } else if (status.includes('Request forwarded to the principal’s office')) {
      return 47;
    } else if (status.includes('Request returned to the registrar for review')) {
      return 30;
    } else if (status.includes('Request is signed by the principal')) {
      return 63;
    } else if (status.includes('Ready for Pickup at the Registrar\'s Office')) {
      return 100;
    } else {
      return 0;
    }
  }
  

    getLabelColor(status: string, labelToHighlight: string, targetProgress: number): string {
    const progress = this.calculateProgress(status);
    if (progress >= targetProgress) {
      return 'green';
    } else {
      return 'grey';
    }
  }
  

}
