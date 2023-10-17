import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TicketsListService } from '../../services/tickets-list.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'company-users-drop-down',
  templateUrl: './company-users-drop-down.component.html',
  styleUrls: ['./company-users-drop-down.component.scss'],
  providers: [TicketsListService],
})
export class CompanyUsersDropDownComponent extends DropDownComponent {

  constructor(public elRef: ElementRef,
    public companiesStateService: CompaniesStateService,
    public usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public companiesService: CompaniesService,
    public ticketsListService: TicketsListService,) {
    super(elRef, companiesStateService, usersStateService, customerPortalStateService, companiesService);
  }

  @Input() clientType: string;
  ngOnInit() {
    /*  if (this.class.length > 0) this.class = this.class;
      if (this.uiType) this.class.push(this.uiType);
      if (this.companiesStateService.isInitLightAllCompanies && this.clientType == undefined) this.getClientsList(this.companiesStateService.getLightCompanies());
      if (this.companiesStateService.isInitLightClientsCompanies && this.clientType) this.getClientsList(this.companiesStateService.getLightClientsCompanies());
  
      this.companiesStateService.onLightCompanies.subscribe((data) => {
        if (this.clientType == undefined) this.getClientsList(data);
      })
      this.companiesStateService.onLightClientsCompanies.subscribe((data) => {
        if (this.clientType != undefined) this.getClientsList(data);
      })
  */
    if (this.usersStateService.getAllUsers().length > 0) this.onGetUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetUsers(data);
    })
  }
  onGetUsers(data) {
    this.reqList = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) {
        return item;
      }
    });
    this.list = JSON.parse(JSON.stringify(this.reqList));
  }
  /**
 * @description Check if use "search", will filter list items by 'field'. If 'field' no exist filter will by Array String. If search element doesn't exist, will init logic to show icon for add
 * @param {Object} event - Object from input
*/
  onCheckAdd(event) {
    this.list = this.reqList.filter(item => this.getUserName(item).toLowerCase().toLowerCase().includes(event.target.value.toLowerCase()) || item.customerCompaniesInfo.some(customerCompany => customerCompany.clientCompanyName.toLowerCase().includes(event.target.value.toLowerCase())));
  }
  public getClientsList(data) {
    this.reset(data);
    if (this.customerPortalStateService.isCustomerPortal) {
      this.list = this.list.filter(item => {
        let customerCompaniesInfo = this.usersStateService.getCurrentUser().customerCompaniesInfo.find(customerCompaniesInfo => customerCompaniesInfo.companyId === item.id);
        if (customerCompaniesInfo && customerCompaniesInfo.customerUserRole && customerCompaniesInfo.customerUserRole.getPermission('VIEW_MY_TICKETS')) return true;
        return false;
      })
    }
  }
  onOpenChange(data) {
    if (data && !this.companiesStateService.isInitLightAllCompanies && this.clientType == undefined) this.companiesStateService.onInitGetLightCompanies();
    if (data && !this.companiesStateService.isInitLightClientsCompanies && this.clientType != undefined) this.companiesStateService.onInitGetLightClietnsCompanies();
  }
  getUserName(item) {
    return `${item.firstName} ${item.lastName}`;
  }
  getCompanyName(item) {
    return item.customerCompaniesInfo.map(customerCompany => customerCompany.clientCompanyName).join(",");
  }
}
