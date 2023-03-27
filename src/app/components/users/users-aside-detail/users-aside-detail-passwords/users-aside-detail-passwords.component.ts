import { Component, Input, OnInit } from '@angular/core';
import { PasswordDeviceUser } from 'src/app/components/password-manager/class/password-device-user';
import { PasswordRecord } from 'src/app/components/password-manager/class/password-record';
import { PasswordManagerComponent } from 'src/app/components/password-manager/password-manager.component';
import { PasswordManagerListService } from 'src/app/components/password-manager/services/password-manager-list.service';
import { REMOVE_RECORD } from 'src/app/const/confirm';
import { User } from '../../class/user';

@Component({
  selector: 'users-aside-detail-passwords',
  templateUrl: './users-aside-detail-passwords.component.html',
  styleUrls: ['./users-aside-detail-passwords.component.scss'],
  providers: [PasswordManagerListService]
})
export class UsersAsideDetailPasswordsComponent extends PasswordManagerComponent {
  @Input() user: User;

  ngOnInit() {
    this.elRef.nativeElement.querySelector(".qt-page-list__body").scrollTo(0, 0);
    this.filter.setSort('USERNAME');
    this.filter.setDeviceUser(new PasswordDeviceUser(this.user.id, this.user.firstName, "USER"));
    this.onScroll();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_RECORD) this.onRemoveRecord(this.passwordManagerStateService.getRecordForRemove().id);
      }
    })
    this.sub.add(getConfirm);
    let geLefttFilter = this.passwordManagerStateService.getOnFilter().subscribe((data) => {

      this.filter.setFilter(data);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(geLefttFilter);
    let onChangeRealTime = this.passwordManagerStateService.onChangeRealTime.subscribe(newChange => {
      if (newChange.action === 'PASSWORD_RECORD_CREATED') {
        this.list_records.push(new PasswordRecord(newChange.data));
      } else if (newChange.action === 'PASSWORD_RECORD_UPDATED') {
        let indexList = this.list_records.findIndex(item => item.id === newChange.data.id);
        if (indexList > -1) this.list_records[indexList] = new PasswordRecord(newChange.data);
      } else if (newChange.action === 'PASSWORD_RECORD_DELETED') {
        let indexList = this.list_records.findIndex(item => item.id === newChange.data.id);
        if (indexList > -1) this.list_records.splice(indexList, 1);
      }
      if (!this.cd['destroyed']) this.cd.detectChanges();
    })
    this.sub.add(onChangeRealTime);
    if (this.passwordManagerStateService.getCategories().length === 0) this.passwordManagerStateService.onInit();
  }
}