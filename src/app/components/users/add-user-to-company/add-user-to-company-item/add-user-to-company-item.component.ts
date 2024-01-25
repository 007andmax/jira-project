import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CrmCompanyIndustry } from 'src/app/components/setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CrmCompanyJobTitle } from 'src/app/components/setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { Company } from 'src/app/interfaces/company/company';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { TechUsersService } from 'src/app/services/setting/tech-users.service';
import { UsersService } from 'src/app/services/users/users.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { User } from '../../class/user';
import { UserCustomSubscription } from '../../class/user-custom-subscription';
import { UsersTableService } from '../../users-table/services/users-table.service';
import { UserTableCustomSubscriptionComponent } from '../../users-table/user-table-custom-subscription/user-table-custom-subscription.component';

@Component({
  selector: 'app-add-user-to-company-item',
  templateUrl: './add-user-to-company-item.component.html',
  styleUrls: ['./add-user-to-company-item.component.scss']
})
export class AddUserToCompanyItemComponent implements OnInit {
  @Input() selected: boolean = false;
  @Input() user: User;
  @Output() onSelectUser = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private usersService: UsersService,
    public usersStateService: UsersStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private draftEmailStateService: DraftEmailStateService,
    public cd: ChangeDetectorRef,
    private crmStateService: CrmStateService,
    private permissionsService: PermissionsService,
    private techUsersService: TechUsersService,
    public customerPortalStateService: CustomerPortalStateService,
    private elRef: ElementRef) { }

  ngOnInit() {
  }
  getUserName() {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  selectUser(event) {
    if (event.target.checked) {
      this.draftEmailStateService.addSelectedUser(this.user);
    } else {
      let list = this.draftEmailStateService.getSelectedUsers();
      let index = list.findIndex(item => item.id === this.user.id);
      if (index > -1) this.draftEmailStateService.removeSelectedUser(index);
    }
    this.onSelectUser.emit(this.user);
    this.cd.detectChanges();
  }
}
