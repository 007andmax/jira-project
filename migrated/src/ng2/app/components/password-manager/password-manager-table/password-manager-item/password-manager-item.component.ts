import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiPasswordManagerService } from 'src/ng2/app/services/password-manager/api-password-manager.service';
import { PasswordManagerService } from 'src/ng2/app/services/password-manager/password-manager.service';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { PasswordRecord } from '../../class/password-record';


@Component({
  selector: 'app-password-manager-item',
  templateUrl: './password-manager-item.component.html',
  styleUrls: ['./password-manager-item.component.scss']
})
export class PasswordManagerItemComponent implements OnInit {
  @Input() item: PasswordRecord;
  @Output() onSelectRecord = new EventEmitter<any>();
  togglePassword: boolean = false;
  constructor(private apiPasswordManagerService: ApiPasswordManagerService,
    private permissionsService: PermissionsService,
    private passwordManagerService: PasswordManagerService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
  }

  showPassword() {
    this.apiPasswordManagerService.setOpenRecord(this.item.id).subscribe((data: any) => {
      this.item.setPassword(data.password);
      this.togglePassword = true;
    })
  }
  copyPassword() {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = this.item.password;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  isExpired() {
    let current = new Date().getTime();
    let expired = new Date(this.item.expiredDate).getTime();
    return expired < current;
  }
  isExpiredLess30() {
    let current = new Date().getTime();
    let expired = new Date(this.item.expiredDate).getTime();
    let day = (expired - current) / 86400000;
    return day <= 30;
  }
  parseExpiredDate() {
    let current = new Date().getTime();
    let expired = new Date(this.item.expiredDate).getTime();
    let day = (expired - current) / 86400000;
    return `${Math.round(day)} days to expire`;
  }
  public editRecord(item) {
    this.passwordManagerService.showEditFrom(null);
  }
}
