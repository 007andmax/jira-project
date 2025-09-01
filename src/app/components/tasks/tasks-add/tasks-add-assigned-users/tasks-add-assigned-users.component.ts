import { Component, Input } from '@angular/core';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { TicketsFilterDropDownComponent } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-drop-down/tickets-filter-drop-down.component';

@Component({
  selector: 'app-tasks-add-assigned-users',
  templateUrl: './tasks-add-assigned-users.component.html',
  styleUrls: ['./tasks-add-assigned-users.component.scss'],
  providers: [CompanyTagsListService, TicketsListService]
})
export class TasksAddAssignedUsersComponent extends TicketsFilterDropDownComponent {
  @Input() reducerItem: Function = (item) => `${item.firstName} ${item.lastName}`;


  /**
* @description Check if element dropdown added in selectedItems
* @param {Object} newItem - selected element
*/
  isSelected(data) {
    return this.selectedTag.find(item => item.id == data.id);
  }
  /**
 * @description Toogle selected element and clear input
 * @param {Object} newItem - selected element
 */
  public toggleItem(newItem) {
    let findIndex = this.selectedTag.findIndex(item => item.id == newItem.id);
    if (findIndex > -1) {
      this.selectedTag.splice(findIndex, 1);
    } else {
      this.selectedTag.push(newItem);
      this.list = JSON.parse(JSON.stringify(this.reqList));
    }
    this.filterChange.emit(this.selectedTag);
    this.userInput.nativeElement.value = '';

    if (this.searchName.length > 0) {
      this.searchName = "";
      this.setDefaultScoll();
      this.onScroll();
    }
  }
  /**
* @description Filter list by field value
* @param {Object} event - Object from input
*/
  onSearch(event) {
    this.list = this.reqList.filter(item => this.reducerItem(item).toLowerCase().includes(event.target.value.toLowerCase()));
  }
}
