import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { PermissionsService } from "src/app/services/permissions/permissions.service";
import { UsersStateService } from "src/app/states/users/users-state.service";

@Injectable()
export class PermissionTicketsService implements CanActivate {
    constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if (this.usersStateService.getCurrentUser()) return this.getCompanyInfoPermissions('VIEW_ALL_TICKETS') || this.getCompanyInfoPermissions('VIEW_MY_TICKETS') || this.getCompanyInfoPermissions('EDIT_OTHER_TICKETS');
        return new Promise((resolve, reject) => {
            this.usersStateService.getOnGetCurrentuser().subscribe(data => {
                if (this.getCompanyInfoPermissions('VIEW_ALL_TICKETS') || this.getCompanyInfoPermissions('VIEW_MY_TICKETS') || this.getCompanyInfoPermissions('EDIT_OTHER_TICKETS')) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        });
    }
    public getCompanyInfoPermissions(action) {
        let compnayInfo = this.usersStateService.getCurrentUser().customerCompaniesInfo.find(item => item.companyId == localStorage.getItem("company_info_id"))
        if (this.usersStateService.getCurrentUser().accountType == "TECH") return true;
        return (compnayInfo && this.usersStateService.getCurrentUser().accountType == "CLIENT" && compnayInfo.customerUserRole.getPermission(action))
    }
    public getPermissions(action) {
        return this.permissionsService.isAllowed(action)
    }

}