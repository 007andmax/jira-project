import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';


@Injectable()
export class PermissionSettingsCustomerUserService implements CanActivate {
    constructor(private usersStateService: UsersStateService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if (this.usersStateService.getCurrentUser()) return this.usersStateService.getCurrentUser().accountType === "TECH" || this.usersStateService.getCurrentUser().accountType === "CLIENT";
        return new Promise((resolve, reject) => {
            this.usersStateService.getOnGetCurrentuser().subscribe(data => {
                if (this.usersStateService.getCurrentUser().accountType === "TECH") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        });
    }
}