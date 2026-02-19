import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';


@Injectable()
export class PermissionCompanyDevicesService  {
    constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService, private companiesStateService: CompaniesStateService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if (this.usersStateService.getCurrentUser()) return this.getPermissions('VIEW_COMPANIES') || this.getCompanyInfoPermissions('VIEW_ALL_DEVICES');
        return new Promise((resolve, reject) => {
            this.usersStateService.getOnGetCurrentuser().subscribe(data => {
                if (this.getPermissions('VIEW_COMPANIES') || this.getCompanyInfoPermissions('VIEW_ALL_DEVICES')) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        });
    }
    public getCompanyInfoPermissions(action) {
        let compnayInfo = this.usersStateService.getCurrentUser().customerCompaniesInfo.find(item => item.companyId == this.companiesStateService.getCompanyRoutingId())
        if (this.usersStateService.getCurrentUser().accountType == "TECH") return true;
        return (compnayInfo && this.usersStateService.getCurrentUser().accountType == "CLIENT" && compnayInfo.customerUserRole.getPermission(action))
    }
    public getPermissions(action) {
        return this.permissionsService.isAllowed(action)
    }

}