import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { PermissionsService } from "src/app/services/permissions/permissions.service";
import { UsersStateService } from "src/app/states/users/users-state.service";

@Injectable()
export class PermissionQuotesService implements CanActivate {
    constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if (this.usersStateService.getCurrentUser()) return this.getCompanyInfoPermissions('VIEW_ALL_QUOTES');
        return new Promise((resolve, reject) => {
            this.usersStateService.getOnGetCurrentuser().subscribe(data => {
                if (this.getCompanyInfoPermissions('VIEW_ALL_QUOTES')) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        });
    }
    public getCompanyInfoPermissions(action) {
        if (this.usersStateService.getCurrentUser().accountType == "TECH") return true;
        return (this.usersStateService.getCurrentUser().accountType == "CLIENT" && this.usersStateService.getCurrentUser().customerCompaniesInfo.some(compnayInfo => compnayInfo.customerUserRole.getPermission(action)));
    }
    public getPermissions(action) {
        return this.permissionsService.isAllowed(action)
    }

}