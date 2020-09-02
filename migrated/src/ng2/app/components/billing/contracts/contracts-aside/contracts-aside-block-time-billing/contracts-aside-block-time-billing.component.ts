import { Component, OnInit } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';

@Component({
  selector: 'app-contracts-aside-block-time-billing',
  templateUrl: './contracts-aside-block-time-billing.component.html',
  styleUrls: ['./contracts-aside-block-time-billing.component.scss']
})
export class ContractsAsideBlockTimeBillingComponent implements OnInit {
  selectedType = new ContractsFilterType('Block Time', 'BLOCK_TIME', null);
  constructor() { }

  ngOnInit() {
  }

}
