import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TicketsListService } from '../../services/tickets-list.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';

@Component({
  selector: 'company-users-drop-down',
  templateUrl: './company-users-drop-down.component.html',
  styleUrls: ['./company-users-drop-down.component.scss'],
  providers: [TicketsListService],
})
export class CompanyUsersDropDownComponent extends DropDownComponent {
  selectedCustomerCompany: UserCustomerCompaniesInfo;
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
  public isSelectedUser(item, customerCompany) {
    return this.selectedItem && this.selectedCustomerCompany && this.selectedItem.id == item.id && this.selectedCustomerCompany.companyId == customerCompany.companyId;
  }
  getSelectedItemText() {
    return (this.selectedItem) ? this.getUserName(this.selectedItem) : "";
  }
  onGetUsers(data) {
    this.reqList = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) return true;
    });
    this.reqList.sort((a, b) => (this.getUserName(a).toLowerCase() > this.getUserName(b).toLowerCase()) ?
      1 : ((this.getUserName(b).toLowerCase() > this.getUserName(a).toLowerCase()) ? -1 : 0));
    console.log("this.reqList", this.reqList);
    this.list = JSON.parse(JSON.stringify(this.reqList));
  }
  clearClient() {
    this.isAdd = false;
    this.selectedItem = null;
    this.selectedCustomerCompany = null;
    this.elRef.nativeElement.querySelector("#dropdown1").value = "";
    this.list = JSON.parse(JSON.stringify(this.reqList));
    this.onSelectedItem.emit({ user: null, customerCompany: null });
  }
  /**
 * @description Check if use "search", will filter list items by 'field'. If 'field' no exist filter will by Array String. If search element doesn't exist, will init logic to show icon for add
 * @param {Object} event - Object from input
*/
  onCheckAdd(event) {
    this.list = this.reqList.filter(item => this.getUserName(item).toLowerCase().toLowerCase().includes(event.target.value.toLowerCase()) || item.customerCompaniesInfo.some(customerCompany => customerCompany.clientCompanyName.toLowerCase().includes(event.target.value.toLowerCase())));
  }
  onSelectUser(data, customerCompany) {
    this.isAdd = false;
    this.selectedItem = data;
    this.selectedCustomerCompany = customerCompany;
    this.onSelectedItem.emit({ user: data, customerCompany: customerCompany });
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
