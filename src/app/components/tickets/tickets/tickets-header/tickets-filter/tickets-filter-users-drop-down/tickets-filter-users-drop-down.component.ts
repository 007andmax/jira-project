import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TicketsFilterDropDownComponent } from '../tickets-filter-drop-down/tickets-filter-drop-down.component';
import { TicketsListService } from '../../../services/tickets-list.service';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { DynamicTooltipComponent } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.component';
import { MatChipListComponent } from 'src/app/components/shared/mat-chip-list/mat-chip-list.component';
import { MatChipComponent } from 'src/app/components/shared/mat-chip/mat-chip.component';
import { MatFormFieldComponent } from 'src/app/components/shared/mat-form-field/mat-form-field.component';

@Component({
  standalone: true,
  imports: [CommonModule, DynamicTooltipComponent, MatChipComponent, MatChipListComponent, MatFormFieldComponent],
  selector: 'tickets-filter-users-drop-down',
  templateUrl: './tickets-filter-users-drop-down.component.html',
  styleUrls: ['./tickets-filter-users-drop-down.component.scss'],
  providers: [CompanyTagsListService, TicketsListService],

})
export class TicketsFilterUsersDropDownComponent extends TicketsFilterDropDownComponent {
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
