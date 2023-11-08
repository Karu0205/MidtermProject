import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService, Request } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { first, map } from 'rxjs/operators';
import { EmailService } from '../email.service';
import { IonInput } from '@ionic/angular';
@Component({
  selector: 'app-completed',
  templateUrl: './completed.page.html',
  styleUrls: ['./completed.page.scss'],
})
export class CompletedPage implements OnInit {

  copiedText: string = '';
  @ViewChild('textInput', { static: false }) textInput: IonInput;
  fromName: string;
  initialFromName: string;

  toEmail: string = '';
  subject: string = '';
  message: string = '';
  
  accounts = [] as any;
  requests: Request[] = []; 
  items: any[];
  searchText: string;

  completed = [] as any;
  
  
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

      this.requests=req;
    })

    this.dataService.getCompleted()
      .pipe(
        map((completedItems: any[]) => {
          // Store the original items
          this.completed = completedItems;
          return completedItems;
        })
      )
      .subscribe();

   }

  ngOnInit() {

    this.dataService.getCompleted().subscribe((completed) => {
      this.completed = completed.sort((a, b) => {
        // Assuming completedDateTime is a Firebase timestamp (e.g., a Firestore Timestamp).
        // You can access the JavaScript Date from Firebase Timestamp using .toDate().
        const dateA = a.completedDateTime.toDate();
        const dateB = b.completedDateTime.toDate();
    
        // Compare the dates to sort in ascending order, to reverse the order, swap a and b.
        return dateA - dateB;
      });
    });
  }

  searchItems() {
    console.log('SearchItems method called');
    console.log('Search Text:', this.searchText);
  
    this.dataService.getCompleted().subscribe((completedItems: any[]) => {
      if (!this.searchText) {
        // If the search text is empty, sort all items.
        this.completed = completedItems.sort((a, b) => {
          const dateA = a.completedDateTime.toDate();
          const dateB = b.completedDateTime.toDate();
          return dateA - dateB;
        });
        console.log('All items sorted:', this.completed); // Log the sorted items
      } else {
        // If there is a search text, filter and sort items based on it.
        const filteredCompletedItems = completedItems.filter((completed) => {
          const searchText = this.searchText.toLowerCase();
          const match =
            completed.student_name.toLowerCase().includes(searchText) ||
            completed.document_type.toLowerCase().includes(searchText) ||
            completed.request_date.toLowerCase().includes(searchText) ||
            this.formatTimestamp(completed.completedDateTime).toLowerCase().includes(searchText);
          return match;
        });
  
        this.completed = filteredCompletedItems.sort((a, b) => {
          const dateA = a.completedDateTime.toDate();
          const dateB = b.completedDateTime.toDate();
          return dateA - dateB;
        });
  
        console.log('Filtered and sorted items:', this.completed); // Log the filtered and sorted items
      }
    });
  }

  onSearchTextChanged() {
    console.log('Search Text changed:', this.searchText);
    this.searchItems();
  }
  

  formatTimestamp(timestamp: { seconds: number, nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  }


  searchTerm: string = '';
  filteredRequests: any[]; // A new array to hold the filtered requests


  filterRequests() {
    if (this.searchTerm === '') {
      this.filteredRequests = this.requests; // Show all requests if the search bar is empty
    } else {
      this.filteredRequests = this.requests.filter(request => {
        return (
          request.student_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          request.request_date.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          request.document_type.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    }
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

}
