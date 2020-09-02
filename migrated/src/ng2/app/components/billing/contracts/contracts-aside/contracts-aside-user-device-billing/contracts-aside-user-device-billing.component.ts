import { Component, OnInit } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';

@Component({
  selector: 'app-contracts-aside-user-device-billing',
  templateUrl: './contracts-aside-user-device-billing.component.html',
  styleUrls: ['./contracts-aside-user-device-billing.component.scss']
})
export class ContractsAsideUserDeviceBillingComponent implements OnInit {
  selectedType = new ContractsFilterType('Service Contract/by device/by user', 'SERVICE_CONTRACT_DEVICE_USER',null);
  constructor() { }

  ngOnInit() {
  }

}
