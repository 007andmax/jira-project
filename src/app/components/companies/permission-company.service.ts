import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';


@Injectable()
export class PermissionCompanyService implements CanActivate {
    constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        console.log("PermissionCompanyService", 0);
        if (this.usersStateService.getCurrentUser()) {
            console.log("PermissionCompanyService", -1);
            return this.getPermissions('VIEW_COMPANIES');
        }
        return new Promise((resolve, reject) => {
            this.usersStateService.getOnGetCurrentuser().subscribe(data => {
                if (this.getPermissions('VIEW_COMPANIES')) {
                    console.log("PermissionCompanyService", 1);
                    resolve(true);
                } else {
                    console.log("PermissionCompanyService", 2);
                    resolve(false);
                }
            })
        });
    }
    public getPermissions(action) {
        return this.permissionsService.isAllowed(action)
    }

}