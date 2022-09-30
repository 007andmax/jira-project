import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MustMatch } from 'src/app/helpers/must-match.validator';
import { SettingService } from 'src/app/services/setting/setting.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAuthenticatorComponent } from 'src/app/components/shared/google-authenticator/google-authenticator.component';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Subscription } from 'rxjs';
import { GoogleAuthenticatorScratchesComponent } from 'src/app/components/shared/google-authenticator-scratches/google-authenticator-scratches.component';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { LOG_OUT } from 'src/app/const/confirm';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  submitted = false;
  authenticationTypesType = 'BASIC';
  oldPwdCorrect = true;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  public passwordForm: FormGroup;
  show = false;
  sub: Subscription = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private settingService: SettingService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private elRef: ElementRef,
    private usersStateService: UsersStateService,
    private confirmStateService: ConfirmStateService,
  ) { }


  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === LOG_OUT) this.onLogOut();
      }
    })
    this.sub.add(getConfirm);
    /**
     * init form validation and declaration
     */
    this.passwordForm = this.formBuilder.group(
      {
        oldpass: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
        newpass: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
      },
    );

    this.get2FA();
  }
  onLogOut() {
    this.settingService
      .getActivityHistory()
      .pipe(
        map((res: any) => {
          if (res) {
            this.toastr.success('Log out other sessions successfully.');
            const activityHistory = res;
            const currentDevice = res.find(device => {
              return device.current;
            });

            const idsForDelete = [];
            for (let i = 0; i < activityHistory.length; i++) {
              let deviceId = activityHistory[i].id;
              if (deviceId !== currentDevice.id) {
                idsForDelete.push(deviceId);
              }
            }

            if (idsForDelete) {
              this.settingService
                .closeSessions(idsForDelete)
                .subscribe(res => { });
            }
          }
        })
      )
      .subscribe();
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
  showScratchCodes() {
    const modalRef = this.modalService.open(GoogleAuthenticatorScratchesComponent, { windowClass: 'quote-send-modal', backdrop: 'static', keyboard: false });

  }
  // selected auth type
  onAuthTypeChange(type: string) {
    if (type === "GOOGLE_SECURE") {
      const modalRef = this.modalService.open(GoogleAuthenticatorComponent, { windowClass: 'quote-send-modal', backdrop: 'static', keyboard: false });
      let onReset = modalRef.componentInstance.onReset.subscribe(data => {
        this.elRef.nativeElement.querySelector(".authentication-type select").value = this.authenticationTypesType;
      })
      let onSetQrCode = modalRef.componentInstance.onSetQrCode.subscribe(data => {
        this.authenticationTypesType = type;
        this.elRef.nativeElement.querySelector(".authentication-type select").value = this.authenticationTypesType;
      })
      this.sub.add(onSetQrCode);
      return;
    }
    this.settingService
      .twoFactorAuth(type)
      .pipe(
        map(res => {
          this.authenticationTypesType = type;
          this.elRef.nativeElement.querySelector(".authentication-type select").value = this.authenticationTypesType;
        })
      )
      .subscribe();
  }

  /**
   * logout sessions
   */
  logOutSessions() {
    this.confirmStateService.setConfirmAction(LOG_OUT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Are you sure to log out other sessions?`;
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
          this.toastr.success('Password Changed Successfully.');
          this.passwordForm.reset();
          this.submitted = false;
        })
      )
      .subscribe(
        () => { },
        (error: any) => {
          if (error) {
            const errStatus = error.status;
            if (errStatus === 409) {
              this.oldPwdCorrect = false;
              this.toastr.info('Old Password is not correct.');
            } else {
              this.toastr.error(error);
            }
          }
        }
      );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
