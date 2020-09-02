import { Component, OnInit, Input } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';

@Component({
  selector: 'app-contracts-aside-hourly-billing',
  templateUrl: './contracts-aside-hourly-billing.component.html',
  styleUrls: ['./contracts-aside-hourly-billing.component.scss']
})
export class ContractsAsideHourlyBillingComponent implements OnInit {
  selectedType = new ContractsFilterType('Hourly', 'HOURLY', null);
  
  constructor() { }

  ngOnInit() {
  }
 
}
