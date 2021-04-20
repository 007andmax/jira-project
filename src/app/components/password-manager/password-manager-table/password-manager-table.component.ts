import { Component, Input, OnInit, ChangeDetectorRef, OnChanges, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { REMOVE_RECORD } from 'src/app/const/confirm';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { PasswordRecord } from '../class/password-record';
import { PasswordRecordCategories } from '../class/password-record-categories';

/**
 * Password manager data table component
 */
@Component({
  selector: 'app-password-manager-table',
  templateUrl: './password-manager-table.component.html',
  styleUrls: ['./password-manager-table.component.scss'],

})
export class PasswordManagerTableComponent implements OnInit {
  @Input() item: PasswordRecord;
  @Output() onSelectRecord = new EventEmitter<any>();
  togglePassword: boolean = false;
  categories: Array<PasswordRecordCategories> = [];
  constructor(private permissionsService: PermissionsService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private passwordManagerStateService: PasswordManagerStateService,
    private passwordManagerService: PasswordManagerService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.categories = this.passwordManagerStateService.getCategories();
    this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categories = data;
    })
  }
  selectRecord(event) {
    this.onSelectRecord.emit(this.item);
    this.cd.detectChanges();
  }
  showPassword() {
    this.passwordManagerService.setOpenRecord(this.item.id).subscribe((data: any) => {
      this.item.setPassword(data.password);
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
  deleteRecord() {
    this.confirmStateService.setConfirmAction(REMOVE_RECORD);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Are you sure you want to delete the password record?`;
    this.passwordManagerStateService.setRecordForRemove(this.item);
  }
  public editRecord() {
    if (this.getPermissions('VIEW_PASSWORD')) this.passwordManagerService.showEditFrom(this.item);
  }
  parseExpiredDate() {
    let current = new Date().getTime();
    let expired = new Date(this.item.expiredDate).getTime();
    let day = (expired - current) / 86400000;
    return `${Math.round(day)} days to expire`;
  }
}
