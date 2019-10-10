import { Component, OnInit } from "@angular/core";
import { EmailSettingService } from "../email-setting.service";
import { ToastrService } from "ngx-toastr";
import { SettingService } from "src/ng2/app/services/setting/setting.service";

@Component({
  selector: "app-incoming-email",
  templateUrl: "./incoming-email.component.html",
  styleUrls: ["./incoming-email.component.scss"]
})
export class IncomingEmailComponent implements OnInit {
  smtpSettings: {};
  supportMailBox: any;
  loading = false;
  currentComapny: any;
  constants: any;
  currentHost: "";
  inboxEnabled: boolean;

  constructor(
    private emailSettingService: EmailSettingService,
    private settingService: SettingService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.currentCompany();
    this.getConstants();
    this.SMTPSettings();
  }

  currentCompany() {
    this.settingService.currentCompany().subscribe(res => {
      this.currentComapny = res;
      this.inboxEnabled = this.currentComapny.inboxEnabled;
    });
  }

  getConstants() {
    this.emailSettingService.getConstants().subscribe(
      res => {
        this.constants = res;
        if (this.constants) {
          this.currentHost = this.getConstant("mandrill.domain.suffix");
        }
      },
      error => {}
    );
  }

  getConstant(constantName) {
    if (!constantName) {
      return this.constants;
    }

    if (!Array.isArray(constantName)) {
      if (this.constants.hasOwnProperty(constantName)) {
        return this.constants[constantName];
      }
    }
  }

  saveInboxEnabled() {
    this.emailSettingService
      .saveInboxEnabled(this.inboxEnabled)
      .subscribe(res => {});
  }

  SMTPSettings() {
    this.loading = true;
    this.emailSettingService.getSMTPSettings().subscribe(
      (smtp: any) => {
        this.loading = false;
        if (smtp) {
          this.smtpSettings = smtp.smtpSettings;
          this.supportMailBox = smtp.supportMailBox;
        }
      },
      error => {
        this.loading = false;
        this.toastr.error(`Error occured, ${error}`);
      }
    );
  }
}
