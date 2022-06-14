import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SettingService } from 'src/app/services/setting/setting.service';
import { UsersService } from 'src/app/services/users/users.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'google-authenticator',
  templateUrl: './google-authenticator.component.html',
  styleUrls: ['./google-authenticator.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class GoogleAuthenticatorComponent implements OnInit {
  qrCode: string;
  secretCode: string;
  authCode: string = '';
  constructor(private settingService: SettingService,
    private usersStateService: UsersStateService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    config: NgbModalConfig,) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.settingService.getQRCode(this.usersStateService.getCurrentUser().id).subscribe((data: any) => {
      console.log("data", data);
      this.qrCode = `data:image/png;base64,${data.qrBase64}`;
      this.secretCode = data.secretKey;
    })
  }
  submit() {
    if (this.authCode.length > 0) this.settingService.setAuthCode(this.usersStateService.getCurrentUser().id, this.authCode).subscribe((data: any) => {
      if (data.confirmed) {

      }
    })
  }
  closeModal() {
    this.activeModal.close();
  }
}
