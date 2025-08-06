import { EventEmitter, Injectable } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsStateService {
  unreadCount: number;
  onShowNotifications: EventEmitter<any> = new EventEmitter();
  constructor(private notificationsService: NotificationsService) { }

  onInit() {
    this.notificationsService.getCount().subscribe((res: any) => {
      this.unreadCount = res.unreadCount;
    })
  }
  public showNotifications() {
    this.onShowNotifications.emit(null);
  }
  public getUnreadCount() {
    return this.unreadCount;
  }
}
