import { Component, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { DetailContractInterval } from '../../class/detail-contract-interval';
import * as moment from "moment";

@Component({
  selector: 'contract-detail-intervals-drop-down',
  templateUrl: './contract-detail-intervals-drop-down.component.html',
  styleUrls: ['./contract-detail-intervals-drop-down.component.scss']
})
export class ContractDetailIntervalsDropDownComponent extends DropDownComponent {
  selectedItems = [];
  /**
   * @description Return String value seleted item for input
   * @returns  {Object} This is the result
  */
  getSelectedItemText() {
    return this.selectedItems.map(item => `Interval No.${Number(item.title) + 1}`).join(", ");
  }
  /**
* @description Check if use "search", will filter list items by 'reduceItemName'. 
* @param {Object} event - Object from input
*/
  onCheckAdd(event) {
    if (this.search) this.list = this.reqList.filter(item => this.reduceItemName(item).toLowerCase().includes(event.target.value.toLowerCase()))
  }
  /**
      * @description Return String value item from dropdown
      * @param {Object} item - Object selected item
      * @returns {String} This is the result
     */
  reduceItemName(item: DetailContractInterval) {
    return `Interval No.${Number(item.title) + 1} - ${moment(new Date(item.startDate)).format('DD MMM YYYY')} - ${moment(new Date(item.endDate)).format('DD MMM YYYY')}`;
  }

  onSelect(data) {
    this.isAdd = false;
    let index = this.selectedItems.findIndex(item => item.title == data.title);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(data);
    }
    this.onSelectedItem.emit(this.selectedItems);
  }

  public isSelected(item) {
    return this.selectedItems.find(selectedItem => selectedItem.title === item.title);
  }
}
