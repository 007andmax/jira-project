import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
﻿
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SettingService } from 'src/app/services/setting/setting.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { MatErrorComponent } from '../mat-error/mat-error.component';

@Component({
  standalone: true,
  imports: [NgxMaskDirective, MatErrorComponent, CommonModule],
  selector: 'google-authenticator',
  templateUrl: './google-authenticator.component.html',
  styleUrls: ['./google-authenticator.component.scss'],
  providers: [provideNgxMask(), NgbModalConfig, NgbModal]
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
        this.authenticationSuccessfully = true;
        this.onSetQrCode.emit(null);
      } else {
        this.validVerifyCoded = false;
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
