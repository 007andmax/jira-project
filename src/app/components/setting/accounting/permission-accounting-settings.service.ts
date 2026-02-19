import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Injectable()
export class PermissionAccountingSettingsService  {
  constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (this.usersStateService.getCurrentUser()) return this.getPermissions('VIEW_ACCOUNTING_SETTINGS');
    return new Promise((resolve, reject) => {
      this.usersStateService.getOnGetCurrentuser().subscribe(data => {
        if (this.getPermissions('VIEW_ACCOUNTING_SETTINGS')) {
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