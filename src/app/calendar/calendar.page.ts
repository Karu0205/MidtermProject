import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { Router } from '@angular/router';
import { FirebaseService } from '../service/firebase.service';
import { AlertController } from '@ionic/angular';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

    events: Event[] = [];
  selectedEvent: Event = { title: '', description: '', startDate: new Date()};


  constructor(private eventService: EventService, private router: Router,
    private dataService: FirebaseService, private alertController: AlertController,
    private modalController: ModalController) { }

  ngOnInit() {
    this.loadEvents();
    this.sortEventsByStartDate();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
    });
  }

  addEvent() {
    // Create a copy of selectedEvent without an 'id' field
    const { id, ...eventData } = this.selectedEvent;
  
    this.eventService.addEvent(eventData).then((docRef) => {
      // Update the document in Firestore with the generated document ID
      docRef.update({ id: docRef.id }).then(() => {
        // Reset selectedEvent
        this.selectedEvent = { title: '', description: '', startDate: new Date()};
  
        // Now you can use eventData, which includes the document ID
        console.log("Event with ID:", { ...eventData, id: docRef.id });
  
        // Load events if needed
        this.loadEvents();
      });
    });
  }

  sortEventsByStartDate() {
    this.events.sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateA - dateB;
    });
  }
  
  
  
  

  editEvent(event: Event) {
    this.eventService.updateEvent(event).then(() => {
      this.loadEvents();
    });
  }

  async deleteEvent(eventId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Do nothing, the user canceled the deletion.
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.eventService.deleteEvent(eventId).then(() => {
              this.loadEvents();
            });
          }
        }
      ]
    });
  
    await alert.present();
  }

  logOut(){
    this.dataService.logout();
    this.router.navigate(['/adminlogin'])
  }

  openDocu(){
    this.router.navigate(['/admindocu'])
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

}
