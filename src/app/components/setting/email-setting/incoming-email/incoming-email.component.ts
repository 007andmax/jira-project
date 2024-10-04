import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EmailSettingService } from '../../../../services/email-settings/email-setting.service';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/app/services/setting/setting.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-incoming-email',
  templateUrl: './incoming-email.component.html',
  styleUrls: ['./incoming-email.component.scss']
})
export class IncomingEmailComponent implements OnInit, OnDestroy {
  smtpSettings: {};
  supportMailBox: any;
  loading = true;
  currentComapny: any;
  constants: any;
  currentHost: '';
  inboxEnabled: boolean;
  @Input() smtpSettingsInput: any;
  @Input() supportMailBoxInput: any;
  sub: Subscription = new Subscription();
  constructor(
    private emailSettingService: EmailSettingService,
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
    let onCurrentCompany = this.companiesStateService.onCurrentCompany.subscribe(res => {
      this.currentCompany(res);
    })
    this.sub.add(onCurrentCompany);
    this.getConstants();
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
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
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
  public saveInboxEnabled() {
    this.emailSettingService
      .saveInboxEnabled(this.inboxEnabled)
      .subscribe(res => {

      });
  }

  /**
   * smtp settings
   */
  SMTPSettings() {
    this.emailSettingService.getSMTPSettings().subscribe(
      (smtp: any) => {
        if (smtp) {
          this.smtpSettings = smtp.smtpSettings;
          this.supportMailBox = smtp.supportMailBox;
        }
      },
      error => {
        this.toastr.error(`Error Occured, ${error}`);
      }
    );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
