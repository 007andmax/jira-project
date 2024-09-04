import { Component, OnInit } from '@angular/core';
import { CompanyUsersDropDownComponent } from '../../tickets/tickets/ticket-add-aside/company-users-drop-down/company-users-drop-down.component';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';

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
}
