import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class TestPermissionService  {
  constructor(private permissionsService: PermissionsService, private companiesStateService: CompaniesStateService,) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (this.companiesStateService.getCurrentCompany()) return this.companiesStateService.getCurrentCompany().id === "73221c72-f87c-4519-8235-c4b57ad1cc19" || this.companiesStateService.getCurrentCompany().id === "72381bff-127c-4a63-9d2e-6e952350dcbd";
    return new Promise((resolve, reject) => {
      this.companiesStateService.getOnCurrentCompany().subscribe(data => {
        if (data.id === "73221c72-f87c-4519-8235-c4b57ad1cc19" || data.id === "72381bff-127c-4a63-9d2e-6e952350dcbd") {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    });
  }
}
