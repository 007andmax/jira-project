import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserProfile } from '../../users/class/user-profile';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Router } from '@angular/router';
import { User } from '../../users/class/user';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { USERS } from 'src/app/const/emails';
import { UserCustomerCompaniesInfo } from '../../users/class/user-customer-companies-info';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-users-details-header',
  templateUrl: './users-details-header.component.html',
  styleUrls: ['./users-details-header.component.scss']
})
export class UsersDetailsHeaderComponent implements OnInit {
  @Input() user: UserProfile = new UserProfile();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDraftEmail = new EventEmitter<any>();
  selectedCustomerCompaniesInfo: Array<UserCustomerCompaniesInfo> = [];
  constructor(public customerPortalStateService: CustomerPortalStateService,
    private companiesStateService: CompaniesStateService,
    private permissionsService: PermissionsService,
    public usersStateService: UsersStateService,
    private draftEmailStateService: DraftEmailStateService,
    private usersService: UsersService,
    private router: Router,) { }

  ngOnInit() {
    this.usersStateService.onSelectCustomerCompaniesInfo.subscribe(data => {
      this.selectedCustomerCompaniesInfo = data;
    })
  }
  removeCompany() {
    this.selectedCustomerCompaniesInfo.forEach(item => {
      let index = this.user.customerCompaniesInfo.findIndex(company => company.companyId == item.companyId);
      if (index > -1) this.user.customerCompaniesInfo.splice(index, 1);
    })
    this.usersService.updateUser(this.user.getUserForUpdate(this.usersStateService.getuserForEdit())).subscribe(data => {
      this.selectedCustomerCompaniesInfo = [];
    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  goToUsers() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/users/`]);
  }
  public showAsideForDraftEmail() {
    this.onDraftEmail.emit(null);
  }
  edit() {
    this.onEdit.emit(null);
  }
}
