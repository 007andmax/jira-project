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

  getSelectedItemText() {
    return (this.selectedItem) ? this.reduceItemName(this.selectedItem) : "";
  }
  onCheckAdd(event) {
    if (this.search) this.list = this.reqList.filter(item => this.reduceItemName(item).toLowerCase().includes(event.target.value.toLowerCase()))
  }
  reduceItemName(item: DetailContractInterval) {
    return `Interval No.${Number(item.title) + 1} - ${moment(new Date(item.startDate)).format('DD MMM YYYY')} - ${moment(new Date(item.endDate)).format('DD MMM YYYY')}`;
  }
}
