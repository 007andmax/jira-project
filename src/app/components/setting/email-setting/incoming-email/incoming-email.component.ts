import { Component, OnInit, Input } from '@angular/core';
import { EmailSettingService } from '../email-setting.service';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/app/services/setting/setting.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-incoming-email',
  templateUrl: './incoming-email.component.html',
  styleUrls: ['./incoming-email.component.scss']
})
export class IncomingEmailComponent implements OnInit {
  smtpSettings: {};
  supportMailBox: any;
  loading = false;
  currentComapny: any;
  constants: any;
  currentHost: '';
  inboxEnabled: boolean;
  @Input() smtpSettingsInput: any;
  @Input() supportMailBoxInput: any;

  constructor(
    private emailSettingService: EmailSettingService,
    private settingService: SettingService,
    private toastr: ToastrService,
    private companiesStateService: CompaniesStateService,
  ) { }

  /**
   * ng onInit
   */
  ngOnInit() {
    this.smtpSettings = this.smtpSettingsInput;
    this.supportMailBox = this.supportMailBoxInput;
    if (this.companiesStateService.getCurrentCompany()) this.currentCompany(this.companiesStateService.getCurrentCompany());
    this.companiesStateService.onCurrentCompany.subscribe(res => {
      this.currentCompany(res);
    })
    this.getConstants();
    // this.SMTPSettings();
  }

  /**
   * get current company
   */
  currentCompany(res) {
    this.currentComapny = res;
    this.inboxEnabled = this.currentComapny.inboxEnabled;
  }

  /**
   * get constants
   */
  getConstants() {
    this.emailSettingService.getConstants().subscribe(
      res => {
        this.constants = res;
        if (this.constants) {
          this.currentHost = this.getConstant('mandrill.domain.suffix');
        }
      },
      error => { }
    );
  }

  /**
   * get constant based on name
   * @param constantName
   */
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

  /**
   * saved inbox enabled
   */
  saveInboxEnabled() {
    this.emailSettingService
      .saveInboxEnabled(this.inboxEnabled)
      .subscribe(res => {
        this.toastr.success('Saved Successfully');
      });
  }

  /**
   * smtp settings
   */
  SMTPSettings() {
    this.loading = true; $(".loading").css("display", "block");
    this.emailSettingService.getSMTPSettings().subscribe(
      (smtp: any) => {
        this.loading = false; $(".loading").css("display", "none");
        if (smtp) {
          this.smtpSettings = smtp.smtpSettings;
          this.supportMailBox = smtp.supportMailBox;
        }
      },
      error => {
        this.loading = false; $(".loading").css("display", "none");
        this.toastr.error(`Error Occured, ${error}`);
      }
    );
  }
}
