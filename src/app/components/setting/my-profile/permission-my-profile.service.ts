import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { PermissionsService } from "src/app/services/permissions/permissions.service";
import { UsersStateService } from "src/app/states/users/users-state.service";

@Injectable()
export class PermissionMyProfileService implements CanActivate {
    constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if (this.usersStateService.getCurrentUser()) return this.usersStateService.getCurrentUser().accountType == "TECH" || this.getCompanyInfoPermissions();
        return new Promise((resolve, reject) => {
            this.usersStateService.getOnGetCurrentuser().subscribe(data => {
                if (this.usersStateService.getCurrentUser().accountType == "TECH" || this.getCompanyInfoPermissions()) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        });
    }
    public getCompanyInfoPermissions() {
        let compnayInfo = this.usersStateService.getCurrentUser().customerCompaniesInfo.find(item => item.customerUserRole && item.customerUserRole.getPermission('VIEW_MY_PROFILE'))
        if (compnayInfo && this.usersStateService.getCurrentUser().accountType == "CLIENT" && compnayInfo) return true;
        return false;
    }
    public getPermissions(action) {
        return this.permissionsService.isAllowed(action)
    }

}