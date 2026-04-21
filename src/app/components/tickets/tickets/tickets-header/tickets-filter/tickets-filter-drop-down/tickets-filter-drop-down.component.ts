import { DynamicTooltipComponent } from './';
import { MatChipComponent } from './';
import { MatChipListComponent } from './';
import { MatFormFieldComponent } from './';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from '../../../services/tickets-list.service';

@Component({
  standalone: true,
  imports: [DynamicTooltipComponent, MatChipComponent, MatChipListComponent, MatFormFieldComponent, CommonModule],
    selector: 'tickets-filter-drop-down',
    templateUrl: './tickets-filter-drop-down.component.html',
    styleUrls: ['./tickets-filter-drop-down.component.scss'],
    providers: [CompanyTagsListService, TicketsListService],
    standalone: true
})
export class TicketsFilterDropDownComponent extends CompanyTagsComponent {
  @Input() placement: string = 'bottom-left';
  @Input() field: string = null;
  @Input() list: Array<any> = [];
  @Input() reducerItem: Function = (item) => (this.field) ? item[this.field] : item;
  @Input() title = '';
  @Input() placeholder = '';
  @Output() filterChange = new EventEmitter();
  @Input() selectedTag: Array<any> = [];
  reqList: Array<any> = [];
  public ngOnInit() {
  }
  ngDoCheck() {
    if (this.reqList.length === 0) this.reqList = JSON.parse(JSON.stringify(this.list));
  }
  /**
* @description Toogle selected element and clear input
* @param {Object} newItem - selected element
*/
  public toggleItem(newItem) {
    let findIndex = this.selectedTag.findIndex(item => (this.field) ? item[this.field] == newItem[this.field] : item == newItem);
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
 * @description Remove element from selectedTag Array
 * @param {number} index - index of remove element
 */
  public remove(index): void {
    if (index >= 0) {
      this.selectedTag.splice(index, 1);
      this.filterChange.emit(this.selectedTag);
      this.cd.detectChanges();
    }
  }

  /**
* @description Filter list by field value
* @param {Object} event - Object from input
*/
  onSearch(event) {
    this.list = this.reqList.filter(item => ((this.field) ? item[this.field] : item).toLowerCase().includes(event.target.value.toLowerCase()));
  }
  /**
* @description Check if element dropdown added in selectedItems
* @param {Object} newItem - selected element
*/
  isSelected(data) {
    return this.selectedTag.find(item => (this.field) ? item[this.field] == data[this.field] : item == data);
  }
  /**
* @description Return function with structure how need display values in dropdown
* @param {Object} item - selected element
* @returns {Function} This is the result
*/
  reduceItemName(item) {
    return this.reducerItem(item);
  }
}

