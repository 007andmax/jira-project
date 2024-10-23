import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { PermissionsService } from "src/app/services/permissions/permissions.service";
import { UsersStateService } from "src/app/states/users/users-state.service";

@Injectable()
export class PermissionUsersService implements CanActivate {
    constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if (this.usersStateService.getCurrentUser()) return this.getPermissions('VIEW_USERS') || this.getCompanyInfoPermissions('VIEW_MY_PROFILE');
        return new Promise((resolve, reject) => {
            this.usersStateService.getOnGetCurrentuser().subscribe(data => {
                if (this.getPermissions('VIEW_USERS') || this.getCompanyInfoPermissions('VIEW_MY_PROFILE')) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        });
    }
    public getCompanyInfoPermissions(action) {
        return (this.usersStateService.getCurrentUser() && this.usersStateService.getCurrentUser().accountType == "CLIENT" && this.usersStateService.getCurrentUser().customerCompaniesInfo.some(compnayInfo => compnayInfo.customerUserRole.getPermission(action)));
    }
    public getPermissions(action) {
        return this.permissionsService.isAllowed(action)
    }

}