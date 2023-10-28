import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationCount = new BehaviorSubject<number>(0);

  getNotificationCount() {
    return this.notificationCount.asObservable();
  }

  updateNotificationCount(count: number) {
    this.notificationCount.next(count);
  }

  clearNotifications() {
    this.updateNotificationCount(0); // Reset the count to zero
  }
}