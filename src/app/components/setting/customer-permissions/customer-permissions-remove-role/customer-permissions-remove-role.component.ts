import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerPermissionsRemoveRole } from './class/customer-permissions-user-role';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserRole } from 'src/app/components/users/class/user-role';
import { Subscription } from 'rxjs';
import { UserProfile } from 'src/app/components/users/class/user-profile';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'customer-permissions-remove-role',
  templateUrl: './customer-permissions-remove-role.component.html',
  styleUrls: ['./customer-permissions-remove-role.component.scss']
})
export class CustomerPermissionsRemoveRoleComponent implements OnInit {
  @Input() users: Array<CustomerPermissionsRemoveRole> = [];
  @Input() userRoleForRemove: UserRole;
  @Output() onClose = new EventEmitter<any>();
  userRoles: Array<UserRole> = [];
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private usersService: UsersService,
    public usersStateService: UsersStateService,) { }

  ngOnInit() {
    console.log("users", this.users);
    console.log("userRoleForRemove", this.userRoleForRemove);
    this.userRoles = this.usersStateService.getUserRoles();
    let onGetUserRole = this.usersStateService.onGetUserRole.subscribe(data => {
      this.userRoles = this.usersStateService.getUserRoles();
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
}
