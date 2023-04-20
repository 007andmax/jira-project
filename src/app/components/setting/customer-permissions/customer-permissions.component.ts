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

@Component({
  selector: 'customer-permissions',
  templateUrl: './customer-permissions.component.html',
  styleUrls: ['./customer-permissions.component.scss']
})
export class CustomerPermissionsComponent implements OnInit, OnDestroy {
  userRoles: Array<UserRole> = [];
  userPermissions: Array<UserPermissions> = [];
  sections = {};
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    private permissionManageService: PermissionManageService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private usersService: UsersService,) { }

  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.sections = this.permissionManageService.getSectionsCustomPermission();
    console.log(this.getListKeys(this.sections));
    this.userRoles = this.usersStateService.getUserRoles();
    if (!this.usersStateService.isGetUserRole) this.usersStateService.onInitGetUsersRoles();
    let onGetUserRole = this.usersStateService.onGetUserRole.subscribe(data => {
      this.userRoles = this.usersStateService.getUserRoles();
    })
    this.sub.add(onGetUserRole);
    this.usersService.getPermissions().subscribe((data: any) => {
      this.userPermissions = data.map(item => new UserPermissions(item));
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_USER_ROLE) this.removeRole(this.usersStateService.getUserRoleForRemove().id);
      }
    })
    this.sub.add(getConfirm);
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
    } else {
      userPermission.permissions.push(permission);
    }
    this.usersService.changePermission(userPermission.id, userPermission.getDataForRequest()).subscribe(data => {

    })
  }
  removeRole(id) {
    this.usersService.removeRole(id).subscribe(data => {

    })
  }
  onDeleteRole(data) {
    this.confirmStateService.setConfirmAction(DELETE_USER_ROLE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove role`;
    this.usersStateService.setUserRoleForRemove(data);

  }
  getListKeys(data) {
    return Object.keys(data);
  }
  ngOnDestroy(): void {
    $('body').removeClass('page-settings');
  }
}
