import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  constructor(private eventService:EventService, private modalController:ModalController) { }
  events: Event[] = [];

  ngOnInit() {
    
    this.loadEvents();

  }

  loadEvents() {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
    });
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
