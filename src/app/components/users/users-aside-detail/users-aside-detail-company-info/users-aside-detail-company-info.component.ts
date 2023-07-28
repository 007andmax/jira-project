import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UserCustomerCompaniesInfo } from '../../class/user-customer-companies-info';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmCompanyJobTitle } from 'src/app/components/setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { UserRole } from '../../class/user-role';
import { CustomerRoleStateService } from 'src/app/states/customer-role/customer-role-state.service';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { Subscription } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UserProfile } from '../../class/user-profile';
import { MODE_EDIT_SUBSCRIPTION } from 'src/app/const/users';
import { UsersService } from 'src/app/services/users/users.service';
import { UserCustomerCompaniesDefaultSubscribtionAdd } from '../../class/user-customer-companies-default-subscribtion-add';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'users-aside-detail-company-info',
  templateUrl: './users-aside-detail-company-info.component.html',
  styleUrls: ['./users-aside-detail-company-info.component.scss']
})
export class UsersAsideDetailCompanyInfoComponent implements OnInit, OnDestroy {
  @Input() customerCompaniesInfo: UserCustomerCompaniesInfo;
  @Input() user: UserProfile = new UserProfile();
  @Output() onUpdate = new EventEmitter<any>();
  @ViewChild('userRolesDP') userRolesDP: DropDownComponent;
  toggleContainer: boolean = false;
  MODE_EDIT_SUBSCRIPTION = MODE_EDIT_SUBSCRIPTION;
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  userRoles: Array<UserRole> = [];
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private crmStateService: CrmStateService,
    private permissionsService: PermissionsService,
    private usersService: UsersService,
    public usersStateService: UsersStateService,
    public customerRoleStateService: CustomerRoleStateService,) { }

  ngOnInit() {
    this.jobTitleList = this.crmStateService.getJobTitleList();
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = data;
    })
    this.sub.add(onGetJobTitle);
    this.userRoles = this.customerRoleStateService.getUserRoles();
    let onGetUserRole = this.customerRoleStateService.onGetUserRole.subscribe(data => {
      this.userRoles = this.customerRoleStateService.getUserRoles();
      if (this.userRolesDP) this.userRolesDP.reset(this.userRoles);
    })
    this.sub.add(onGetUserRole);
  }
  onSelectJobTitle(data) {
    this.customerCompaniesInfo.setJobTitleDto(data);
    this.onUpdate.emit(null);
  }
  onSelectUserRole(data) {
    this.customerCompaniesInfo.setUserRole(data);
    this.onUpdate.emit(null);
  }
  onChangeHasAccess() {
    this.usersService.updateUser(this.user.getUserForUpdate(this.usersStateService.getuserForEdit())).subscribe(data => {

    })
  }
  onChangeDefaultSubscriptions(data) {
    this.usersService.setSubscriptions(
      {
        ...new UserCustomerCompaniesDefaultSubscribtionAdd(data.ticketSubscription.enabled,
          data.ticketManagerSubscription.enabled,
          data.invoiceSubscription.enabled,
          this.user.id,
          this.customerCompaniesInfo.companyId)
      }).subscribe(res => {
      })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
