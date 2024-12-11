import { Component, OnInit } from '@angular/core';
import { CompanyUsersDropDownComponent } from '../../tickets/tickets/ticket-add-aside/company-users-drop-down/company-users-drop-down.component';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { CompanyUser } from '../../tickets/tickets/ticket-add-aside/company-users-drop-down/class/company-user';

@Component({
  selector: 'app-users-drop-down',
  templateUrl: './users-drop-down.component.html',
  styleUrls: ['./users-drop-down.component.scss'],
  providers: [TicketsListService],
})
export class UsersDropDownComponent extends CompanyUsersDropDownComponent {

  /**
* @description Check if item is selected
* @param {CompanyUser} Companyiser - Object from CompanyUser
 */
  public isSelectedUser(item) {
    return this.selectedItem && this.selectedCustomerCompany && this.selectedItem.id == item.id;
  }

  public reset(data) {
    this.reqList = JSON.parse(JSON.stringify(data)).map(item => new CompanyUser(item));
    this.reqList.sort((a, b) => (this.getUserName(a).toLowerCase() > this.getUserName(b).toLowerCase()) ?
      1 : ((this.getUserName(b).toLowerCase() > this.getUserName(a).toLowerCase()) ? -1 : 0));
    this.list = JSON.parse(JSON.stringify(this.reqList)).map(item => new CompanyUser(item));
    this.ref.markForCheck();
  }
  /**
* @description Set new value selected element and init Output Event
* @param {Object} data - Object selected element
 */
  onSelectUser(data) {
    this.isAdd = false;
    this.selectedItem = data;
    this.onSelectedItem.emit({ user: data });
  }
  /**
* @description Return text selected element
* @returns {String} This is the result
*/
  getSelectedItemText() {
    return (this.selectedItem) ? `${this.getUserName(this.selectedItem)}` : "";
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
      }
      item.setSearchByCompany(null);
      return false;
    });
  }
  getJobTitleDto(user) {
    return user.customerCompaniesInfo.find(item => item.companyId == this.selectedCustomerCompany.companyId).jobTitleDto;
  }
}
