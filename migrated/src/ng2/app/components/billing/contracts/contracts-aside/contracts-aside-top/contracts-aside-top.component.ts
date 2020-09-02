import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';

@Component({
  selector: 'app-contracts-aside-top',
  templateUrl: './contracts-aside-top.component.html',
  styleUrls: ['./contracts-aside-top.component.scss']
})
export class ContractsAsideTopComponent implements OnInit {
  listsTypes = [new ContractsFilterType('Hourly', 'HOURLY', null),
  new ContractsFilterType('Block Time', 'BLOCK_TIME', null),
  new ContractsFilterType('Service Contract/by device/by user', 'SERVICE_CONTRACT_DEVICE_USER',null),
  
  new ContractsFilterType('Service Contract/by other', 'SERVICE_CONTRACT', 'OTHER')];
  @Input() selectedType = new ContractsFilterType('Hourly', 'HOURLY', null);
  
  constructor(private contractsStateService: ContractsStateService) { }

  ngOnInit() {
  }
  onSelectType(data) {
    this.contractsStateService.setType(data);
    console.log("data", data);
  }
}
