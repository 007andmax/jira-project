import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersStateService } from '../../states/users/users-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';

@Injectable()
export class PermissionIntegrationsService implements CanActivate {
  constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (this.usersStateService.getCurrentUser()) return this.getPermissions('MANAGE_INTEGRATIONS');
    return new Promise((resolve, reject) => {
      this.usersStateService.getOnGetCurrentuser().subscribe(data => {
        if (this.getPermissions('MANAGE_INTEGRATIONS')) {
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