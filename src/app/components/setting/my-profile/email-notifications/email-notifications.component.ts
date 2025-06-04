import { Component, OnInit, ViewChild } from "@angular/core";
import { SettingService } from "src/app/services/setting/setting.service";
import { map } from "rxjs/operators";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-email-notifications",
  templateUrl: "./email-notifications.component.html",
  styleUrls: ["./email-notifications.component.scss"]
})
export class EmailNotificationsComponent implements OnInit {
  emailNotifications: any;
  emailForm: FormGroup;
  constructor(
    private settingService: SettingService,
    private formBuilder: FormBuilder,
  ) { }

  /**
   * init
   */
  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      myTicketUpdated: [
        false,
      ],
      newDevice: [
        false,
      ],
      ticketCloseNotifications: [
        false,
      ],
      ticketCreated: [
        false,
      ]
    })
    this.settingService
      .emailNotifications()
      .pipe(
        map(res => {
          this.emailNotifications = res;
          this.emailForm.patchValue({
            myTicketUpdated: this.emailNotifications.myTicketUpdated,
            newDevice: this.emailNotifications.newDevice,
            ticketCloseNotifications: this.emailNotifications.ticketCloseNotifications,
            ticketCreated: this.emailNotifications.ticketCreated
          });
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
