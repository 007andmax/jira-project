import { Component, OnInit } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';

@Component({
  selector: 'app-contracts-aside-product-service-contracts',
  templateUrl: './contracts-aside-product-service-contracts.component.html',
  styleUrls: ['./contracts-aside-product-service-contracts.component.scss']
})
export class ContractsAsideProductServiceContractsComponent implements OnInit {
  selectedType = new ContractsFilterType('Service Contract/by other', 'SERVICE_CONTRACT', 'OTHER');

  constructor() { }

  ngOnInit() {
  }

}
