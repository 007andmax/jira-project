
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PasswordRecord } from 'src/app/components/password-manager/class/password-record';
import { DynamicTooltipComponent } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.component';
import { UploadAreaProgressComponent } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.component';
import { PasswordManagerService } from 'src/app/services/password-manager/password-manager.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppStateService } from 'src/app/states/app/app-state.service';

@Component({
  standalone: true,
  imports: [DynamicTooltipComponent, UploadAreaProgressComponent, CommonModule],
  selector: 'ticket-detail-passwords-item',
  templateUrl: './ticket-detail-passwords-item.component.html',
  styleUrls: ['./ticket-detail-passwords-item.component.scss']
})
export class TicketDetailPasswordsItemComponent implements OnInit, OnDestroy {
  @Input() password: PasswordRecord;
  togglePassword: boolean = false;
  toggleBodyPassword: boolean = false;
  timeCount: number = 0;
  showSecretCode: boolean = false;
  isGetSecretCode: boolean = false;
  intervalContainer: any;
  constructor(private permissionsService: PermissionsService,
    private passwordManagerService: PasswordManagerService,
    private toastrService: ToastrService,
    public cd: ChangeDetectorRef,
    private appStateService: AppStateService) { }


  ngOnInit() {

  }
  onToggleBodyPassword(data) {
    this.toggleBodyPassword = data;
    this.toggleSecretCode();
  }
  toggleSecretCode() {
    this.showSecretCode = !this.showSecretCode;
    if (this.intervalContainer) clearInterval(this.intervalContainer);
    if (!this.showSecretCode) this.isGetSecretCode = false;
    if (this.showSecretCode && this.password.otpEnable) this.getCodeRecords();
  }
  getCodeRecords() {
    this.timeCount = 0;
    this.passwordManagerService.getCodeRecords(this.password.id).subscribe((data: any) => {
      this.password.setOtp(data.otp);
      this.password.setExpirationDate(data.expirationDate);
      this.isGetSecretCode = true;
      let timeout = (this.password.expirationDate - new Date().getTime()) / 1000;
      if (timeout > 0) {
        this.timeCount = Math.ceil(timeout);
        this.intervalContainer = setInterval(() => {
          this.timeCount = (this.timeCount - 1);
          if (this.timeCount < 0) {
            clearInterval(this.intervalContainer);
            this.getCodeRecords();
          }
          this.cd.detectChanges();
        }, 1000);
      }
    })
  }
  showPassword() {
    this.passwordManagerService.setOpenRecord(this.password.id).subscribe((data: any) => {
      this.password.setPassword(data.password);
      this.togglePassword = true;
    })
  }
  copy(value) {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = value
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
    this.toastrService.success("The value is copied to clipboard");
    this.appStateService.changeDetectorRef();
  }
  copyPassword(value) {
    if (!value) {
      this.passwordManagerService.setOpenRecord(this.password.id).subscribe((data: any) => {
        this.password.setPassword(data.password);
        this.copy(data.password)
      })
    } else {
      this.copy(value)
    }

  }
  getCodeProgress() {
    return (this.timeCount / 30) * 100;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    if (this.intervalContainer) clearInterval(this.intervalContainer);
  }
}
