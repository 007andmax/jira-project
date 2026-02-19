import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionCustomerPermissionsService  {
  constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (this.usersStateService.getCurrentUser()) return this.getPermissions('VIEW_COMPANIES') && this.getPermissions('CREATE_COMPANIES') && this.getPermissions('VIEW_USERS') && this.getPermissions('CREATE_USERS');
    return new Promise((resolve, reject) => {
      this.usersStateService.getOnGetCurrentuser().subscribe(data => {
        if (this.getPermissions('VIEW_COMPANIES') && this.getPermissions('CREATE_COMPANIES') && this.getPermissions('VIEW_USERS') && this.getPermissions('CREATE_USERS')) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    });
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }

}