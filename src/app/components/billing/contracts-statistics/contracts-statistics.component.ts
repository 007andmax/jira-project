import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { ContractStatisticsItem } from './class/contracts-statistics-item';

@Component({
  selector: 'contracts-statistics',
  templateUrl: './contracts-statistics.component.html',
  styleUrls: ['./contracts-statistics.component.scss']
})
export class ContractsStatisticsComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

}
