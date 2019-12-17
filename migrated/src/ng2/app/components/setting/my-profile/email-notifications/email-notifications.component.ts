import { Component, OnInit } from "@angular/core";
import { SettingService } from "src/ng2/app/services/setting/setting.service";
import { ToastrService } from "ngx-toastr";
import { map } from "rxjs/operators";

@Component({
  selector: "app-email-notifications",
  templateUrl: "./email-notifications.component.html",
  styleUrls: ["./email-notifications.component.scss"]
})
export class EmailNotificationsComponent implements OnInit {
  emailNotifications: {};

  constructor(
    private settingService: SettingService,
    private toastr: ToastrService
  ) {}

  /**
   * init
   */
  ngOnInit() {
    this.settingService
      .emailNotifications()
      .pipe(
        map(res => {
          this.emailNotifications = res;
        })
      )
      .subscribe();
  }

  /**
   * saved form
   * @param emailForm 
   */
  onSubmit(emailForm) {
    var emailObjToSend = {
      newDevice: emailForm.value.newDevice,
      ticketCreated: emailForm.value.ticketCreated,
      myTicketUpdated: emailForm.value.myTicketUpdated,
      ticketCloseNotifications:
        emailForm.value.ticketCloseNotifications || false
    };

    this.settingService
      .email(emailObjToSend)
      .pipe(
        map(res => {
          this.toastr.success("Email Notification Changed Successfully");
        })
      )
      .subscribe();
  }
}
