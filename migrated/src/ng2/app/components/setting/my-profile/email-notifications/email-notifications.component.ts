import { Component, OnInit } from "@angular/core";
import { SettingService } from "src/ng2/app/services/setting/setting.service";
import { ToastrService } from "ngx-toastr";

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
      ticketCloseNotifications:
        emailForm.value.ticketCloseNotifications || false
    };

    this.settingService.email(emailObjToSend).subscribe(
      (res: any) => {
        
        this.toastr.success("Email notification changed successfully",'',{
          timeOut: 7000
        });

      },
      error => {
        this.toastr.error(error);
      }
    );
  }
}
