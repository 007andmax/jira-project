import { Component, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';

@Component({
  selector: 'contract-detail-drop-down',
  templateUrl: './contract-detail-drop-down.component.html',
  styleUrls: ['./contract-detail-drop-down.component.scss']
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
  getSelectedItemText() {
    return (this.selectedItem) ? this.reduceItemName(this.selectedItem) : "";
  }
  public getType(item) {
    if (item.type === "SERVICE_CONTRACT" && item.billType === "OTHER") return 'Subscriptions';
    return `${this.contractTypeDictionary[item.type]}${(item.billType) ? this.billTypeDictionary[item.billType] : ""}`
  }
  reduceItemName(item) {
    return `${this.getType(item)} - ${item.description}`;
  }
}
