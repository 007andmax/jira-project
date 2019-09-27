import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/ng2/app/services/setting/setting.service';

@Component({
  selector: 'app-email-notifications',
  templateUrl: './email-notifications.component.html',
  styleUrls: ['./email-notifications.component.scss']
})
export class EmailNotificationsComponent implements OnInit {
  emailNotifications: {};

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.settingService.emailNotifications().subscribe(res => {
      this.emailNotifications = res;
    });
  }

  onSubmit(emailForm) {
    var emailObjToSend = {
      newDevice: emailForm.value.newDevice,
      ticketCreated: emailForm.value.ticketCreated,
      myTicketUpdated: emailForm.value.myTicketUpdated,
      ticketCloseNotifications: emailForm.value.ticketCloseNotifications || false
    };

    this.settingService.email(emailObjToSend).subscribe(res => { });

  }

}
