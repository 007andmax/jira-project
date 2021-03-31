import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CompaniesService } from '../../services/company/companies.service';
import { PasswordManagerService } from '../../services/password-manager/password-manager.service';
import { UsersService } from '../../services/users/users.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { PasswordManagerComponent } from '../password-manager/password-manager.component';
import { PasswordRecord } from '../password-manager/class/password-record';
import { PasswordManagerListService } from '../password-manager/services/password-manager-list.service';


@Component({
  selector: 'company-password-manager',
  templateUrl: './company-password-manager.component.html',
  styleUrls: ['./company-password-manager.component.scss'],
  providers: [PasswordManagerListService]
})
export class CompanyPasswordManagerComponent extends PasswordManagerComponent {


  public getRecords() {
    console.log("getRecords");
    this.passwordManagerService.getCompanyRecords(localStorage.getItem('company_id')).subscribe((res: any) => {
      console.log("res", res);
      this.filter.setCompany(this.companiesStateService.getCompanies().find(item => item.id == localStorage.getItem('company_id')));
      this.recordsData = res.map(item => new PasswordRecord(item));
      this.recordsData.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
        1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;

      this.onScroll();
      this.cd.detectChanges();
    });
  }
}
