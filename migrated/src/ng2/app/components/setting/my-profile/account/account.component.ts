import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { MustMatch } from "src/ng2/app/helpers/must-match.validator";
import { SettingService } from "src/ng2/app/services/setting/setting.service";
import { ToastrService } from "ngx-toastr";
import { map } from "rxjs/operators";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit {
  submitted = false;
  authenticationTypesType = "BASIC";
  oldPwdCorrect = true;
  public passwordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private settingService: SettingService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    /**
     * init form validation and declaration
     */
    this.passwordForm = this.formBuilder.group(
      {
        oldpass: ["", [Validators.required, Validators.minLength(6)]],
        newpass: ["", [Validators.required, Validators.minLength(6)]],
        confirmPass: ["", Validators.required]
      },
      {
        validator: MustMatch("newpass", "confirmPass")
      }
    );

    this.get2FA();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.passwordForm.controls;
  }

  get2FA() {
    this.settingService
      .get2FA()
      .pipe(
        map((res: any) => {
          if (res) {
            this.authenticationTypesType = res.value;
          }
        })
      )
      .subscribe();
  }

  // selected auth type
  onAuthTypeChange(type: string) {
    this.settingService
      .twoFactorAuth(type)
      .pipe(
        map(res => {
          this.toastr.success("Auth Type Changed Successfully");
        })
      )
      .subscribe();
  }

  /**
   * logout sessions
   */
  logOutSessions() {
    if (confirm("Are you sure to log out other sessions ")) {
      this.settingService
        .getActivityHistory()
        .pipe(
          map((res: any) => {
            if (res) {
              this.toastr.success("Log out other sessions successfully.");
              const activityHistory = res;
              const currentDevice = res.find(device => {
                return device.current;
              });

              const idsForDelete = [];
              for (var i = 0; i < activityHistory.length; i++) {
                var deviceId = activityHistory[i].id;
                if (deviceId !== currentDevice.id) {
                  idsForDelete.push(deviceId);
                }
              }

              if (idsForDelete) {
                this.settingService
                  .closeSessions(idsForDelete)
                  .subscribe(res => {});
              }
            }
          })
        )
        .subscribe();
    }
  }

  /**
   * saved form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }

    this.settingService
      .resetPassword(
        this.passwordForm.value.oldpass,
        this.passwordForm.value.newpass
      )
      .pipe(
        map(res => {
          this.oldPwdCorrect = true;
          this.toastr.success("Password Changed Successfully.");
        })
      )
      .subscribe(
        () => {},
        (error: any) => {
          if (error) {
            const errStatus = error.status;
            if (errStatus === 409) {
              this.oldPwdCorrect = false;
              this.toastr.info("Old Password is not correct.");
            } else {
              this.toastr.error(error);
            }
          }
        }
      );
  }
}
