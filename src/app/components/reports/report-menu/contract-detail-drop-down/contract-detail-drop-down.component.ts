import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';

@Component({
  standalone: true,
  imports: [CommonModule, MatErrorComponent, NgbDropdownModule],
  selector: 'contract-detail-drop-down',
  templateUrl: './contract-detail-drop-down.component.html',
  styleUrls: ['./contract-detail-drop-down.component.scss'],

})
export class ContractDetailDropDownComponent extends DropDownComponent {
  contractTypeDictionary = {
    HOURLY: 'Custom Hourly',
    BLOCK_TIME: 'Block Time',
    SERVICE_CONTRACT: 'Service Contract'
  };
  billTypeDictionary = {
    DEVICE: '/by device',
    USER: '/by user',
  };
  /**
  * @description Check if use "search", will filter list items by 'reduceItemName'. 
  * @param {Object} event - Object from input
 */
  onCheckAdd(event) {
    if (this.search) this.list = this.reqList.filter(item => this.reduceItemName(item).toLowerCase().includes(event.target.value.toLowerCase()))
  }
  /**
    * @description Return String value seleted item for input
    * @returns  {Object} This is the result
   */
  getSelectedItemText() {
    return (this.selectedItem) ? this.reduceItemName(this.selectedItem) : "";
  }
  /**
    * @description Return String value item by type
    * @param {Object} item - Object selected item
    * @returns {String} This is the result
   */
  public getType(item) {
    if (item.type === "SERVICE_CONTRACT" && item.billType === "OTHER") return 'Subscriptions';
    return `${this.contractTypeDictionary[item.type]}${(item.billType) ? this.billTypeDictionary[item.billType] : ""}`
  }
  /**
    * @description Return String value item from dropdown
    * @param {Object} item - Object selected item
    * @returns {String} This is the result
   */
  reduceItemName(item) {
    return `${this.getType(item)} - ${item.description}`;
  }
}
