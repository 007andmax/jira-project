import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/app/services/setting/setting.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'google-authenticator',
  templateUrl: './google-authenticator.component.html',
  styleUrls: ['./google-authenticator.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class GoogleAuthenticatorComponent implements OnInit {
  @Output() onReset = new EventEmitter();
  @Output() onSetQrCode = new EventEmitter();
  authenticationSuccessfully: boolean = false;
  qrCode: string;
  secretCode: string;
  authCode: string = '';
  validVerifyCoded: boolean = true;
  tab: string = 'STEP-1';
  verifyCoded = ['', '', '', '', '', ''];
  constructor(private settingService: SettingService,
    private usersStateService: UsersStateService,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    private elRef: ElementRef,
    config: NgbModalConfig,) {
    config.backdrop = 'static';
    config.keyboard = false;

  }

  ngOnInit() {

  }
  changeVerifyCode(event, index) {
    if (event.target.value != "") {
      this.validVerifyCoded = true;
      this.verifyCoded[index] = event.target.value;
      if (index != 5) this.elRef.nativeElement.querySelectorAll("#verify-code .authenticator-input")[index + 1].focus();
    }
  }
  getQRCode() {
    this.settingService.getQRCode(this.usersStateService.getCurrentUser().id).subscribe((data: any) => {
      this.qrCode = `data:image/png;base64,${data.qrBase64}`;
      this.secretCode = data.secretKey;
    })
  }
  next() {
    if (this.tab == 'STEP-3') {
      this.authenticationSuccessfully = false;
      if (!this.verifyCoded.find(item => item == '')) {
        this.authCode = this.verifyCoded.join('');
        this.submit();
      }
    }
    if (this.tab == 'STEP-2') this.tab = 'STEP-3';
    if (this.tab == 'STEP-1') {
      this.tab = 'STEP-2';
      this.getQRCode();
    }

  }
  submit() {
    if (this.authCode.length > 0) this.settingService.setAuthCode(this.usersStateService.getCurrentUser().id, this.authCode).subscribe((data: any) => {
      if (data.confirmed) {
        this.toastrService.success("Authentication type has been successfully changed");
        this.authenticationSuccessfully = true;
        this.appStateService.changeDetectorRef();
        this.onSetQrCode.emit(null);
      } else {
        this.validVerifyCoded = false;
        this.toastrService.error("The verification code is not valid");
      }
    })
  }
  cancel() {
    this.onReset.emit(null);
    this.closeModal();
  }
  closeModal() {
    this.activeModal.close();
  }
}
