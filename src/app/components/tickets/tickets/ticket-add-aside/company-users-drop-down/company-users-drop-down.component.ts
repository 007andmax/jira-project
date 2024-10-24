import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TicketsListService } from '../../services/tickets-list.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';
import { CompanyUser } from './class/company-user';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'company-users-drop-down',
  templateUrl: './company-users-drop-down.component.html',
  styleUrls: ['./company-users-drop-down.component.scss'],
  providers: [TicketsListService],
})
export class CompanyUsersDropDownComponent extends DropDownComponent {
  @Input() isShowTooltip: boolean = false;
  sub: Subscription = new Subscription();
  @Input() selectedCustomerCompany: UserCustomerCompaniesInfo;
  @Input() selectedItem = null;
  @Input() tooltipMessage = "";
  constructor(public elRef: ElementRef,
    public companiesStateService: CompaniesStateService,
    public usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public companiesService: CompaniesService,
    public ticketsListService: TicketsListService,
    public devicesService: DevicesService,
    public cd: ChangeDetectorRef,) {
    super(elRef, companiesStateService, usersStateService, customerPortalStateService, companiesService, devicesService, cd);
  }
  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) this.onGetUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetUsers(data);
    })
    this.sub.add(getOnUsers);
    let onEditUser = this.usersStateService.onEditUser.subscribe((data) => {
      this.onGetUsers(this.usersStateService.getAllUsers());
    })
    this.sub.add(onEditUser);
  }
  /**
 * @description Check if item is selected
 * @param {CompanyUser} Companyiser - Object from CompanyUser
 * @param {UserCustomerCompaniesInfo} customerCompany - Object from UserCustomerCompaniesInfo
*/
  public isSelectedUser(item, customerCompany) {
    return this.selectedItem && this.selectedCustomerCompany && this.selectedItem.id == item.id && this.selectedCustomerCompany.companyId == customerCompany.companyId;
  }
  /**
 * @description Return text selected element
 * @returns {String} This is the result
*/
  getSelectedItemText() {
    return (this.selectedItem && this.selectedCustomerCompany) ? `${this.getUserName(this.selectedItem)} - ${this.selectedCustomerCompany.clientCompanyName}` : "";
  }
  /**
 * @description Init logic to get user list from global request
*/
  onGetUsers(data) {
    this.reqList = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) return true;
    }).map(item => new CompanyUser(item));
    this.reqList.sort((a, b) => (this.getUserName(a).toLowerCase() > this.getUserName(b).toLowerCase()) ?
      1 : ((this.getUserName(b).toLowerCase() > this.getUserName(a).toLowerCase()) ? -1 : 0));
    this.list = JSON.parse(JSON.stringify(this.reqList)).map(item => new CompanyUser(item));
  }
  checkCompanyForCustomerPortal(item) {
    let customerCompaniesInfo = this.usersStateService.getCurrentUser().customerCompaniesInfo.find(customerCompaniesInfo => customerCompaniesInfo.companyId === item.companyId);
    if (customerCompaniesInfo && customerCompaniesInfo.customerUserRole && customerCompaniesInfo.customerUserRole.getPermission('VIEW_MY_TICKETS') && item.eligibleForTicket == true) return true;
    return false;
  }
  /**
 * @description Clear selected fileds, input and reset list
*/
  clearClient() {
    this.isAdd = false;
    this.selectedItem = null;
    this.selectedCustomerCompany = null;
    this.elRef.nativeElement.querySelector("#dropdown1").value = "";
    this.reqList.forEach(item => item.setSearchByCompany(null));
    this.list = JSON.parse(JSON.stringify(this.reqList)).map(item => new CompanyUser(item));
    this.onSelectedItem.emit({ user: null, customerCompany: null });
  }
  /**
 * @description Check if use "search", will filter list items by 'field'. If 'field' no exist filter will by Array String. If search element doesn't exist, will init logic to show icon for add
 * @param {Object} event - Object from input
*/
  onCheckAdd(event) {
    this.list = this.reqList.filter(item => {
      if (this.getUserName(item).toLowerCase().toLowerCase().includes(event.target.value.toLowerCase())) {
        item.setSearchByCompany(null);
        return true;
      } else if (item.customerCompaniesInfo.some(customerCompany => customerCompany.clientCompanyName.toLowerCase().includes(event.target.value.toLowerCase()))) {
        item.setSearchByCompany(item.customerCompaniesInfo.find(customerCompany => customerCompany.clientCompanyName.toLowerCase().includes(event.target.value.toLowerCase())));
        return true;
      }
      item.setSearchByCompany(null);
      return false;
    });
  }
  public selectItemWithOutChanges(data) {
    this.isAdd = false;
    this.selectedItem = data.user;
    this.selectedCustomerCompany = data.customerCompany;
    this.ref.markForCheck();
  }
  /**
 * @description Set new value selected element and init Output Event
 * @param {Object} data - Object selected element
 * @param {UserCustomerCompaniesInfo} customerCompany - Object of UserCustomerCompaniesInfo
*/
  onSelectUser(data, customerCompany) {
    this.isAdd = false;
    this.selectedItem = data;
    this.selectedCustomerCompany = customerCompany;
    this.onSelectedItem.emit({ user: data, customerCompany: customerCompany });
  }
  /**
* @description Return parse First and Last name user
* @param {Object} data - Object of User
*/
  getUserName(item) {
    return `${item.firstName} ${item.lastName}`;
  }
  /**
* @description Return parse text list companies of user
* @param {Object} data - Object of User
*/
  getCompanyName(item) {
    return item.customerCompaniesInfo.map(customerCompany => customerCompany.clientCompanyName).join(",");
  }
}
