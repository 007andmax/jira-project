import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UsersService } from 'src/app/services/users/users.service';
import { UserRole } from '../../users/class/user-role';
import { UserPermissions } from '../../users/class/user-permissions';
import { PermissionManageService } from '../tech-users-settings/permission-manage/permission-manage.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DELETE_USER_ROLE } from 'src/app/const/confirm';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { CustomerPermissionsRemoveRole } from './customer-permissions-remove-role/class/customer-permissions-user-role';
import { CustomerRoleStateService } from 'src/app/states/customer-role/customer-role-state.service';
import { CustomerRoleRealTimeService } from 'src/app/states/customer-role/customer-role-real-time.service';

@Component({
  selector: 'customer-permissions',
  templateUrl: './customer-permissions.component.html',
  styleUrls: ['./customer-permissions.component.scss']
})
export class CustomerPermissionsComponent implements OnInit, OnDestroy {
  userRoles: Array<UserRole> = [];
  userPermissions: Array<UserPermissions> = [];
  usersForChangeRole: Array<CustomerPermissionsRemoveRole> = [];
  sections = {};
  userRoleForRemove: UserRole;
  showRemoveRole: boolean = false;
  loading: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    private permissionManageService: PermissionManageService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private customerRoleStateService: CustomerRoleStateService,
    private customerRoleRealTimeService: CustomerRoleRealTimeService,
    private usersService: UsersService,) { }

  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.sections = this.permissionManageService.getSectionsCustomPermission();
    this.userRoles = this.customerRoleStateService.getUserRoles();
    if (!this.customerRoleStateService.isGetUserRole) this.customerRoleStateService.onInitGetUsersRoles();
    let onGetUserRole = this.customerRoleStateService.onGetUserRole.subscribe(data => {
      this.userRoles = this.customerRoleStateService.getUserRoles();
    })
    this.sub.add(onGetUserRole);
    this.usersService.getPermissions().subscribe((data: any) => {
      this.userPermissions = data.map(item => new UserPermissions(item));
      this.loading = false;
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_USER_ROLE) this.removeRole(this.usersStateService.getUserRoleForRemove().id);
      }
    })
    this.sub.add(getConfirm);
    let changeRoleArray = this.customerRoleRealTimeService.changeRoleArray.subscribe(newChange => {
      if (newChange.action === 'CUSTOMER_ROLE_CREATED' || newChange.action === 'CUSTOMER_ROLE_UPDATED') {
        const Index = this.userPermissions.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.userPermissions[Index] = new UserPermissions(newChange.data);
        if (Index === -1) this.userPermissions.unshift(new UserPermissions(newChange.data));
      }
      if (newChange.action === 'CUSTOMER_ROLE_DELETED') {
        const Index = this.userPermissions.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.userPermissions.splice(Index, 1);
      }
    })
    this.sub.add(changeRoleArray);
  }
  userReadable(str: string) {
    return str
      .split('_')
      .map(function (word) {
        return word[0] + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
  checkRole(role, permission) {
    return (this.userPermissions.find(item => item.id === role.id)) ? this.userPermissions.find(item => item.id === role.id).permissions.indexOf(permission) > -1 : false;
  }
  togglePermission(role, permission) {
    let userPermission = this.userPermissions.find(item => item.id == role.id);
    let index = userPermission.permissions.indexOf(permission);
    if (index > -1) {
      userPermission.permissions.splice(index, 1);
      let listPermissionsForRemove = [];
      if (permission === "VIEW_MY_TICKETS" || permission === "VIEW_ALL_TICKETS") listPermissionsForRemove = this.customerRoleStateService.VIEW_MY_TICKETS_related_permissions;
      if (permission === "VIEW_MY_PROFILE" || permission === "VIEW_ALL_USERS") listPermissionsForRemove = this.customerRoleStateService.VIEW_MY_PROFILE_related_permissions;
      if (permission === "VIEW_ALL_DEVICES") listPermissionsForRemove = this.customerRoleStateService.VIEW_ALL_DEVICES_related_permissions;
      userPermission.permissions = userPermission.permissions.filter(item => listPermissionsForRemove.indexOf(item) == -1);
    } else {
      userPermission.permissions.push(permission);
    }
    this.usersService.changePermission(userPermission.id, userPermission.getDataForRequest()).subscribe(data => {

    })
  }
  isPermissionDisabled(permission, role) {
    let userPermission = this.userPermissions.find(item => item.id == role.id);
    if (!userPermission) return false;
    if (
      userPermission.permissions.indexOf('VIEW_MY_TICKETS') === -1 &&
      ["VIEW_ALL_TICKETS"].indexOf(permission) > -1
    ) {
      return true;
    } else if (
      userPermission.permissions.indexOf('VIEW_ALL_TICKETS') === -1 &&
      ["EDIT_OTHER_TICKETS"].indexOf(permission) > -1
    ) {
      return true;
    } else if (
      userPermission.permissions.indexOf('VIEW_MY_PROFILE') === -1 &&
      ["VIEW_ALL_USERS"].indexOf(permission) > -1
    ) {
      return true;
    } else if (
      userPermission.permissions.indexOf('VIEW_ALL_USERS') === -1 &&
      ["EDIT_USERS"].indexOf(permission) > -1
    ) {
      return true;
    } else if (
      userPermission.permissions.indexOf('VIEW_ALL_DEVICES') === -1 &&
      ["DEVICES_REMOTE_CONTROL"].indexOf(permission) > -1
    ) {
      return true;
    } else {
      return false;
    }

  }
  removeRole(id) {
    this.usersService.removeRole(id).subscribe(data => {

    }, err => {
      if (err.status == 406) {
        this.userRoleForRemove = this.userRoles.find(item => item.id == id);
        this.usersForChangeRole = err.error.map(item => new CustomerPermissionsRemoveRole(item));
        this.showRemoveRole = true;
      }
    })
  }
  onDeleteRole(data) {
    this.confirmStateService.setConfirmAction(DELETE_USER_ROLE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove role`;
    this.usersStateService.setUserRoleForRemove(data);

  }
  getListKeys(data) {
    return Object.keys(data);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    $('body').removeClass('page-settings');
  }
}
