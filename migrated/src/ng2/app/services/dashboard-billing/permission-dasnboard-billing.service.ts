import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable( )
export class PermissionDasnboardBillingService implements CanActivate {
  constructor(private permissionsService: PermissionsService,) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.getPermissions('VIEW_ACCOUNTING_DASHBOARD');
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
 
}