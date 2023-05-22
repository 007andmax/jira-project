import { EventEmitter, Injectable } from '@angular/core';
import { UserRole } from 'src/app/components/users/class/user-role';
import { UsersService } from 'src/app/services/users/users.service';
import { CustomerRoleRealTimeService } from './customer-role-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerRoleStateService {
  isGetUserRole: boolean = false;
  userRoles: Array<UserRole> = [];
  onGetUserRole: EventEmitter<any> = new EventEmitter();
  VIEW_MY_TICKETS_related_permissions = ["VIEW_ALL_TICKETS", "EDIT_OTHER_TICKETS"];
  VIEW_MY_PROFILE_related_permissions = ["VIEW_ALL_USERS", "EDIT_USERS"];
  VIEW_ALL_DEVICES_related_permissions = ["DEVICES_REMOTE_CONTROL"];
  constructor(private userService: UsersService,
    private customerRoleRealTimeService: CustomerRoleRealTimeService) { }
  public onInit() {
    this.customerRoleRealTimeService.changeRoleArray.subscribe(newChange => {
      if (newChange.action === 'CUSTOMER_ROLE_CREATED' || newChange.action === 'CUSTOMER_ROLE_UPDATED') {
        const Index = this.userRoles.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.userRoles[Index] = new UserRole(newChange.data);
        if (Index === -1) this.userRoles.unshift(new UserRole(newChange.data));
      }
      if (newChange.action === 'CUSTOMER_ROLE_DELETED') {
        const Index = this.userRoles.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.userRoles.splice(Index, 1);
      }

      this.onGetUserRole.emit(this.userRoles);
    })
  }
  public onInitGetUsersRoles() {
    this.userService.getUserRoles().subscribe((data: any) => {
      this.userRoles = data;
      this.onGetUserRole.emit(this.userRoles);
      this.isGetUserRole = true;
    })
  }
  public getUserRoles() {
    return this.userRoles;
  }
}
