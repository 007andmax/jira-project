import { Component, Input, OnInit } from '@angular/core';
import { ContractStatisticsItem } from '../../class/contracts-statistics-item';

@Component({
    selector: 'contracts-statistics-table-item',
    templateUrl: './contracts-statistics-table-item.component.html',
    styleUrls: ['./contracts-statistics-table-item.component.scss'],
    standalone: true
})
export class ContractsStatisticsTableItemComponent implements OnInit {
  @Input() contract: ContractStatisticsItem;
  constructor() { }

  ngOnInit() {
  }

}
