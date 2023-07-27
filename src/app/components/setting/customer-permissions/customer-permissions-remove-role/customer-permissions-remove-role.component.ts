import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
export class CustomerPermissionsRemoveRoleComponent implements OnInit {
  @Input() users: Array<CustomerPermissionsRemoveRole> = [];
  @Input() userRoleForRemove: UserRole;
  @Output() onClose = new EventEmitter<any>();
  @ViewChild('userRolesDP', { static: false }) userRolesDP: DropDownComponent;
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
  getUserAvatarUrl(user) {
    if (!(user && user.avatar)) return '';

    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / contain no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / contain no-repeat`;
    } else {
      return 'url(/users/default/image.jpg) 0% 0% / contain no-repeat';
    }
  };
  getNameForAvatar(user) {
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
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
}
