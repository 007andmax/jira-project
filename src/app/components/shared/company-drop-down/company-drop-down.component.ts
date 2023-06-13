import { Component, Input, OnInit } from '@angular/core';
import { DropDownComponent } from '../drop-down/drop-down.component';

@Component({
  selector: 'company-drop-down',
  templateUrl: './company-drop-down.component.html',
  styleUrls: ['./company-drop-down.component.scss']
})
export class CompanyDropDownComponent extends DropDownComponent {
  @Input() clientType: string;
  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    if (this.companiesStateService.isInitLightAllCompanies && this.clientType == undefined) this.getClientsList(this.companiesStateService.getLightCompanies());
    if (this.companiesStateService.isInitLightClientsCompanies && this.clientType) this.getClientsList(this.companiesStateService.getLightClientsCompanies());

    this.companiesStateService.onLightCompanies.subscribe((data) => {
      if (this.clientType == undefined) this.getClientsList(data);
    })
    this.companiesStateService.onLightClientsCompanies.subscribe((data) => {
      if (this.clientType != undefined) this.getClientsList(data);
    })

  }
  public getClientsList(data) {
    this.reset(data);
    if (this.customerPortalStateService.isCustomerPortal) {
      this.list = this.list.filter(item => {
        let customerCompaniesInfo = this.usersStateService.getCurrentUser().customerCompaniesInfo.find(customerCompaniesInfo => customerCompaniesInfo.companyId === item.id);
        if (customerCompaniesInfo && customerCompaniesInfo.customerUserRole && customerCompaniesInfo.customerUserRole.getPermission('VIEW_MY_TICKETS')) return true;
        return false;
      })
      console.log("this.list ", this.list);
    }
  }
  onOpenChange(data) {
    if (data && !this.companiesStateService.isInitLightAllCompanies && this.clientType == undefined) this.companiesStateService.onInitGetLightCompanies();
    if (data && !this.companiesStateService.isInitLightClientsCompanies && this.clientType != undefined) this.companiesStateService.onInitGetLightClietnsCompanies();
  }
}
