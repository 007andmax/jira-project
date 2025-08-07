import { EventEmitter, Injectable } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { NotificationsRealTimeService } from './notifications-real-time.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsStateService {
  unreadCount: number;
  onShowNotifications: EventEmitter<any> = new EventEmitter();
  constructor(private notificationsService: NotificationsService,
    private notificationsRealTimeService: NotificationsRealTimeService
  ) { }

  onInit() {
    this.notificationsService.getCount().subscribe((res: any) => {
      this.unreadCount = res.unreadCount;
    })
    this.notificationsRealTimeService.changeArray.subscribe(data => {
      if (data.action == "USER_NOTIFICATION_COUNT") this.unreadCount = data.data;
    })
  }
  public showNotifications() {
    this.onShowNotifications.emit(null);
  }
  public getUnreadCount() {
    return this.unreadCount;
  }
}
