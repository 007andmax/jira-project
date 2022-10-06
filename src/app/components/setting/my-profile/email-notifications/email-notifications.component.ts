import { Component, OnInit, ViewChild } from "@angular/core";
import { SettingService } from "src/app/services/setting/setting.service";
import { ToastrService } from "ngx-toastr";
import { map } from "rxjs/operators";

@Component({
  selector: "app-email-notifications",
  templateUrl: "./email-notifications.component.html",
  styleUrls: ["./email-notifications.component.scss"]
})
export class EmailNotificationsComponent implements OnInit {
  emailNotifications: any;
  @ViewChild('emailForm') emailForm: any;
  constructor(
    private settingService: SettingService,
    private toastr: ToastrService
  ) { }

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
  onSubmit() {
    var emailObjToSend = {
      newDevice: this.emailForm.value.newDevice,
      ticketCreated: this.emailForm.value.ticketCreated,
      myTicketUpdated: this.emailForm.value.myTicketUpdated,
      ticketCloseNotifications:
        this.emailForm.value.ticketCloseNotifications || false
    };

    this.settingService
      .email(emailObjToSend)
      .subscribe();
  }
}
