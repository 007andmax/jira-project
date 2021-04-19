import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NotificationStateService } from './services/notification-state.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
    message: string = '';
  show: boolean = false;
  constructor(private notificationStateService:NotificationStateService,public cd: ChangeDetectorRef) { }

  ngOnInit() {
      this.notificationStateService.getShowNotification().subscribe((message) => {
      this.message = message;
      this.show = true;
      this.cd.detectChanges();
      setTimeout(() => {
        this.show = false;
        this.cd.detectChanges();
      }, 2000);
    })
  }

}
