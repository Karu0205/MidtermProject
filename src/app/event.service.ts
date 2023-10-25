import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Event } from './event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private firestore: AngularFirestore) {}

  getEvents() {
    return this.firestore.collection<Event>('events', ref => ref.orderBy('startDate')).valueChanges();
  }

  addEvent(event: Event) {
    return this.firestore.collection<Event>('events').add(event);
  }

  updateEvent(event: Event) {
    const id = event.id;
    delete event.id; // Remove the ID property temporarily
    return this.firestore.doc(`events/${id}`).update(event);
  }

  deleteEvent(eventId: string) {
    return this.firestore.doc(`events/${eventId}`).delete();
    
  }
}

