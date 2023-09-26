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

  reduceItemName(item: DetailContractInterval) {
    return `interval #${item.title} ${moment(new Date(item.startDate)).format('YYYY.MM.DD')} - ${moment(new Date(item.endDate)).format('YYYY.MM.DD')}`;
  }
}
