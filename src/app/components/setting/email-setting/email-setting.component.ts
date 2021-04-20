import { Component, OnInit, OnDestroy } from "@angular/core";
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { EmailSettingService } from './email-setting.service';
declare var $: any;
@Component({
  selector: "app-email-setting",
  templateUrl: "./email-setting.component.html",
  styleUrls: ["./email-setting.component.scss"]
})
export class EmailSettingComponent implements OnInit, OnDestroy {
  smtp: any;
  supportMailBox: any;
  targetEmail = "";
  smtpSettings: {};
  savedSMTPSettings;
  usedEmailVia: any;
  portIsEmpty = false;
  showIn = false;
  emailVia = [
    {
      value: false,
      label: "Quicktech mail server"
    },
    {
      value: true,
      label: "Custom"
    },
    {
      value: true,
      label: "Gmail"
    },
    {
      value: true,
      label: "Yahoo"
    },
    {
      value: true,
      label: "Outlook"
    }
  ];
  preinitializedDomains = {
    GMAIL: {
      domain: "smtp.gmail.com"
    },
    YAHOO: {
      domain: "smtp.mail.yahoo.com"
    },
    OUTLOOK: {
      domain: "smtp-mail.outlook.com",
      port: 587,
      encryptionType: "TLS"
    }
  };
  constructor(private emailSettingService: EmailSettingService,
    private settingStateService: SettingStateService) { }

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.SMTPSettings();
    this.settingStateService.setComponentName('EmailSettingComponent');
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }

  /**
   * smtp settings
   */
  SMTPSettings() {
    this.emailSettingService.getSMTPSettings().subscribe(
      (response: any) => {
        if (response) {
          this.smtpSettings = response.smtpSettings;
          this.supportMailBox = response.supportMailBox;
          this.smtp = response.smtpSettings;
          this.supportMailBox = response.supportMailBox;

          this.smtp.testEmail = response.login;
          this.savedSMTPSettings = response;
          this.portIsEmpty = !response.port;
          this.usedEmailVia = this.smtp.useSMTP
            ? this.getEmailViaByDomain(this.smtp.domain)
            : this.emailVia[0];
          this.showIn = true;

        }
      },
      (error: any) => {
      }
    );
  }

  getEmailViaByDomain(domain) {
    var counter = 0;
    for (var prop in this.preinitializedDomains) {
      var defaultSmtp = this.preinitializedDomains[prop];
      if (domain === defaultSmtp.domain) {
        return this.emailVia[counter + 2];
      }
      counter++;
    }
  }

}
