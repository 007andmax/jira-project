import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';


@Injectable()
export class PermissionCompanyService  {
    constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService, private customerPortalStateService: CustomerPortalStateService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if (this.usersStateService.getCurrentUser()) return this.getPermissions('VIEW_COMPANIES') || this.customerPortalStateService.isCustomerPortal;
        return new Promise((resolve, reject) => {
            this.usersStateService.getOnGetCurrentuser().subscribe(data => {
                if (this.getPermissions('VIEW_COMPANIES') || this.customerPortalStateService.isCustomerPortal) {
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