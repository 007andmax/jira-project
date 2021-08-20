import { Component, Input, OnInit } from '@angular/core';
import { PasswordRecord } from 'src/app/components/password-manager/class/password-record';
import { PasswordManagerComponent } from 'src/app/components/password-manager/password-manager.component';
import { PasswordManagerListService } from 'src/app/components/password-manager/services/password-manager-list.service';
import { User } from '../../class/user';

@Component({
  selector: 'users-aside-detail-passwords',
  templateUrl: './users-aside-detail-passwords.component.html',
  styleUrls: ['./users-aside-detail-passwords.component.scss'],
  providers: [PasswordManagerListService]
})
export class UsersAsideDetailPasswordsComponent extends PasswordManagerComponent {
  @Input() user: User;

  public getRecords() {
    this.passwordManagerService.getRecordsForUserDetail(this.user.id).subscribe((res: any) => {
      this.recordsData = res.map(item => new PasswordRecord(item));
      this.recordsData.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
        1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      this.onScroll();
      this.cd.detectChanges();
    });
  }
}