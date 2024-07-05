import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CustomerPermissionsRemoveRole } from './class/customer-permissions-user-role';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserRole } from 'src/app/components/users/class/user-role';
import { Subscription } from 'rxjs';
import { UserProfile } from 'src/app/components/users/class/user-profile';
import { UsersService } from 'src/app/services/users/users.service';
import { CustomerRoleStateService } from 'src/app/states/customer-role/customer-role-state.service';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  selector: 'customer-permissions-remove-role',
  templateUrl: './customer-permissions-remove-role.component.html',
  styleUrls: ['./customer-permissions-remove-role.component.scss']
})
export class CustomerPermissionsRemoveRoleComponent implements OnInit, OnDestroy {
  @Input() users: Array<CustomerPermissionsRemoveRole> = [];
  @Input() userRoleForRemove: UserRole;
  @Output() onClose = new EventEmitter<any>();
  @ViewChild('userRolesDP') userRolesDP: DropDownComponent;
  userRoles: Array<UserRole> = [];
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private usersService: UsersService,
    public customerRoleStateService: CustomerRoleStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public usersStateService: UsersStateService,) { }

  ngOnInit() {
    this.userRoles = this.customerRoleStateService.getUserRoles();
    let onGetUserRole = this.customerRoleStateService.onGetUserRole.subscribe(data => {
      this.userRoles = this.customerRoleStateService.getUserRoles();
      if (this.userRolesDP) this.userRolesDP.reset(this.userRoles);
    })
    this.sub.add(onGetUserRole);
  }
  onSelectUserRole(user, data, index) {
    user.customerCompanyInfo[index].setUserRole(data);
    let userForUpdate: UserProfile = new UserProfile();
    userForUpdate.onEdit(this.usersStateService.getAllUsers().find(item => item.id == user.id));
    userForUpdate.customerCompaniesInfo = user.customerCompanyInfo;
    this.usersService.updateUser(userForUpdate.getUserForUpdate(this.usersStateService.getAllUsers().find(item => item.id == user.id))).subscribe(data => {
      //  this.close();
    })
  }
  getCompanyName(companyId) {
    return this.companiesStateService.getCompanies().find(item => item.id === companyId).name;
  }
  close() {
    this.onClose.emit(null);
  }
  removeRole() {

    if (this.users.find(user => user.customerCompanyInfo.find(item => item.customerUserRole.id == this.userRoleForRemove.id) ? true : false)) return;
    this.usersService.removeRole(this.userRoleForRemove.id).subscribe(data => {
      this.close();
    })
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
