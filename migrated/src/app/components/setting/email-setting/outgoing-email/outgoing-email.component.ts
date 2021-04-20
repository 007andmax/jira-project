import { Component, OnInit, Input } from "@angular/core";
import { EmailSettingService } from "../email-setting.service";
import { SettingService } from "src/app/services/setting/setting.service";
import { ToastrService } from "ngx-toastr";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-outgoing-email",
  templateUrl: "./outgoing-email.component.html",
  styleUrls: ["./outgoing-email.component.scss"]
})
export class OutgoingEmailComponent implements OnInit {
  smtp: any;
  supportMailBox: any;
  targetEmail = "";
  smtpForm: FormGroup;
  testEmailForm: FormGroup;
  submitted = false;
  loading = false;
  isSMTPLoginUnique = true;
  disableFields = false;
  portIsEmpty = false;
  initialized = false;
  create = false;
  showPassword = false;
  emailAlias: "";
  smtpPromise;
  inboxEnabledPromise;
  savedSMTPSettings;
  usedEmailVia: any;
  portToTypes = {
    NONE: 25,
    TLS: 587,
    SSL: 465
  };
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
  emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  domainPattern = /^(((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?))|((?:[0-9]{1,3}\.){3}[0-9]{1,3})$/;
  @Input() smtpSettingsInput: any;
  @Input() supportMailBoxInput: any;
  @Input() smtpInput: any;
  @Input() testEmailInput: any;
  @Input() savedSMTPSettingsInput: any;
  @Input() portIsEmptyInput: any;
  @Input() usedEmailViaInput: any;

  constructor(
    private emailSettingService: EmailSettingService,
    private settingService: SettingService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) { }

  /**
   * init
   */
  ngOnInit() {
    this.smtpForm = this.formBuilder.group({
      emailAlias: [
        this.emailAlias,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ])
      ],
      usedEmailVia: [""],
      domain: [
        "",
        [Validators.required, , Validators.pattern(this.domainPattern)]
      ],
      port: [
        "",
        [Validators.required, Validators.min(0), Validators.max(65535)]
      ],
      encryptionType: [""],
      login: [
        "",
        [
          Validators.required,
          Validators.maxLength(128),
          Validators.pattern(this.emailPattern)
        ]
      ],
      password: ["", [Validators.required]],
      id: [""]
    });

    this.SMTPSettingsInput();
    this.getEmailAlias();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.smtpForm.controls;
  }

  get t() {
    return this.testEmailForm.controls;
  }

  /**
   * email alias
   */
  getEmailAlias() {
    this.emailSettingService.getEmailAlias().subscribe(
      (res: any) => {
        if (res) {
          this.emailAlias = res.emailAlias;
          this.smtpForm.patchValue({
            emailAlias: this.emailAlias
          });
        }
      },
      error => { }
    );
  }

  /**
   * number only
   * @param event
   */
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  SMTPSettingsInput() {
    this.smtp = this.smtpInput;
    this.supportMailBox = this.supportMailBoxInput;
    this.smtp.testEmail = this.testEmailInput;
    this.savedSMTPSettings = this.savedSMTPSettingsInput;
    this.portIsEmpty = this.portIsEmptyInput;
    this.usedEmailVia = this.usedEmailViaInput;
    if (!this.smtp.useSMTP || this.disableFields) {
      this.smtpForm.get("login").disable();
      this.smtpForm.get("domain").disable();
      this.smtpForm.get("port").disable();
      this.smtpForm.get("encryptionType").disable();
      this.smtpForm.get("password").disable();
    } else {
      this.smtpForm.get("login").enable();
      this.smtpForm.get("domain").enable();
      this.smtpForm.get("port").enable();
      this.smtpForm.get("encryptionType").enable();
      this.smtpForm.get("password").enable();
    }

    this.smtpForm.patchValue({
      usedEmailVia: this.usedEmailVia.label,
      port: this.smtp.port,
      domain: this.smtp.domain,
      encryptionType: this.smtp.encryptionType,
      login: this.smtp.login,
      password: this.smtp.password
    });
  }

  /**
   * smtp settings
   */
  SMTPSettings() {
    this.loading = true; $(".loading").css("display", "block");
    this.emailSettingService.getSMTPSettings().subscribe(
      (response: any) => {
        this.loading = false; $(".loading").css("display", "none");
        if (response) {
          this.smtp = response.smtpSettings;
          this.supportMailBox = response.supportMailBox;

          this.smtp.testEmail = response.login;
          this.savedSMTPSettings = response;
          this.portIsEmpty = !response.port;
          this.usedEmailVia = this.smtp.useSMTP
            ? this.getEmailViaByDomain(this.smtp.domain)
            : this.emailVia[0];

          if (!this.smtp.useSMTP || this.disableFields) {
            this.smtpForm.get("login").disable();
            this.smtpForm.get("domain").disable();
            this.smtpForm.get("port").disable();
            this.smtpForm.get("encryptionType").disable();
            this.smtpForm.get("password").disable();
          } else {
            this.smtpForm.get("login").enable();
            this.smtpForm.get("domain").enable();
            this.smtpForm.get("port").enable();
            this.smtpForm.get("encryptionType").enable();
            this.smtpForm.get("password").enable();
          }

          this.smtpForm.patchValue({
            usedEmailVia: this.usedEmailVia.label,
            port: this.smtp.port,
            domain: this.smtp.domain,
            encryptionType: this.smtp.encryptionType,
            login: this.smtp.login,
            password: this.smtp.password
          });
        }
      },
      (error: any) => {
        this.loading = false; $(".loading").css("display", "none");
        this.toastr.error(`Error Occured, ${error.errorMessage}`);
      }
    );
  }

  /**
   * get email by domain
   * @param domain
   */
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

  /**
   * check smtp login unique
   */
  checkSMTPLoginUnique() {
    this.submitted = true;
    if (this.smtpForm.controls["login"].errors) {
      return;
    }

    this.emailSettingService
      .checkSMTPLoginUnique(this.smtpForm.value.login)
      .subscribe(
        (resp: any) => {
          this.isSMTPLoginUnique = resp;
          this.submitted = false;
        },
        error => {
          this.isSMTPLoginUnique = false;
        }
      );
  }

  /**
   *isChangedEvent - notification display or not based on param 
   */
  changeEmailVia() {
    if (!this.smtpForm.value.usedEmailVia) {
      return;
    }

    const selectedEmailVia: any = this.emailVia.filter(
      email => email.label === this.smtpForm.value.usedEmailVia
    );
    this.smtp.useSMTP = selectedEmailVia[0].value;
    if (!this.smtp.useSMTP || this.disableFields) {
      this.smtpForm.get("login").disable();
      this.smtpForm.get("domain").disable();
      this.smtpForm.get("port").disable();
      this.smtpForm.get("encryptionType").disable();
      this.smtpForm.get("password").disable();
    } else {
      this.smtpForm.get("login").enable();
      this.smtpForm.get("domain").enable();
      this.smtpForm.get("port").enable();
      this.smtpForm.get("encryptionType").enable();
      this.smtpForm.get("password").enable();
    }
    this.setDomain(selectedEmailVia[0].label.toUpperCase());
    this.saveSMTP(this.smtpForm, undefined);
  }

  /**
   *
   * @param value
   */
  changeEncryption(value) {
    if (value) {
      if (this.initialized || this.portIsEmpty) {
        var port = this.portToTypes[value];
        if (port) {
          this.smtp.port = port;
          this.smtpForm.patchValue({
            port: port
          });
        }
      } else {
        this.initialized = true;
      }
    }
  }

  /**
   * set domain based on params
   * @param value
   */
  setDomain(value) {
    if (!this.disableFields) {
      var domain = this.preinitializedDomains[value],
        port = this.portToTypes[this.smtp.encryptionType];

      if (domain) {
        for (var prop in domain) {
          this.smtp[prop] = domain[prop];
          switch (prop) {
            case "domain":
              this.smtpForm.patchValue({
                domain: domain[prop]
              });
              break;
            case "port":
              this.smtpForm.patchValue({
                port: domain[prop]
              });
            case "encryptionType":
              this.smtpForm.patchValue({
                encryptionType: domain[prop]
              });
            default:
              break;
          }
        }

        if (port && !domain.port) {
          this.smtp.port = port;
          this.smtpForm.patchValue({
            port: port
          });
        }
      }
    }
  }

  /**
   * saved smtp
   * @param formForSave
   * @param formForTest
   * @param isTest
   */
  sendTestEmail(formForSave, formForTest, isTest) {
    // $scope.showError = formForTest.$invalid;
    if (formForTest.valid && isTest) {
      this.saveSMTP(formForSave, isTest);
    }
  }

  /**
   * saved smtp
   * @param form
   * @param isTest
   */
  saveSMTP(form, isTest) {
    this.submitted = true;
    this.loading = true; $(".loading").css("display", "block");
    if (this.isSMTPLoginUnique) {
      if (this.smtpForm.valid && this.smtp.useSMTP) {
        this.smtp.login = this.smtpForm.value.login;
        this.smtp.password = this.smtpForm.value.password;
        // this.smtp.domain = this.smtpForm.value.domain;
        // this.smtp.port = this.smtpForm.value.port;
        this.smtp.encryptionType = this.smtpForm.value.encryptionType;
        this.smtp.exeption = false;
        this.disableFields = !!isTest;

        this.smtp.sendTestEmail = !!isTest;

        this.emailSettingService.SMTPSettings(this.smtp).subscribe(
          (res: any) => {
            this.loading = false; $(".loading").css("display", "none");
            this.savedSMTPSettings = this.smtp;
            this.smtp.testEmail = this.savedSMTPSettings.login;

            if (res.errorMessage && !res.valid) {
              this.toastr.error(`${res.errorMessage}`);
            } else {
              this.toastr.success("Saved Successfully");
            }

            this.disableFields = false;
            this.submitted = false;
          },
          error => {
            this.loading = false; $(".loading").css("display", "none");
            // this.toastr.error(`Error Occured, ${error}`);
          }
        );
      } else if (!this.smtp.useSMTP) {
        this.toastr.error("useSMTP else if");
        this.smtp.login = "";
        this.smtp.password = "";
        this.smtpForm.patchValue({
          login: "",
          password: ""
        });
        this.emailSettingService.SMTPSettings(this.smtp).subscribe(
          (res: any) => {
            this.loading = false; $(".loading").css("display", "none");
          },
          (error: any) => {
            this.loading = false; $(".loading").css("display", "none");
            this.toastr.error(`Error Occured, ${error}`);
          }
        );
      }
    } else {
      this.loading = false; $(".loading").css("display", "none");
      this.isSMTPLoginUnique = false;
    }
  }

  /**
   * saved email alias
   */
  saveEmailAlias() {
    if (!this.smtpForm.controls["emailAlias"].errors) {
      this.emailSettingService
        .saveEmailAlias(this.smtpForm.value.emailAlias)
        .subscribe(
          res => { },
          error => { }
        );
    }
  }
}
