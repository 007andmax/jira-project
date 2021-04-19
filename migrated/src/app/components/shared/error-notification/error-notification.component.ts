import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ErrorNotificationStateService } from './services/error-notification-state.service';

@Component({
  selector: 'app-error-notification',
  templateUrl: './error-notification.component.html',
  styleUrls: ['./error-notification.component.scss']
})
export class ErrorNotificationComponent implements OnInit {

  message: string = '';
  show: boolean = false;
  constructor(private notificationStateService:ErrorNotificationStateService,public cd: ChangeDetectorRef) { }

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
