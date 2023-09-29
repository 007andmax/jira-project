import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContractStatisticsItem } from '../class/contracts-statistics-item';
import { ContractsService } from 'src/app/services/contracts/contracts.service';

@Component({
  selector: 'contracts-statistics-table',
  templateUrl: './contracts-statistics-table.component.html',
  styleUrls: ['./contracts-statistics-table.component.scss']
})
export class ContractsStatisticsTableComponent implements OnInit {

  list: Array<ContractStatisticsItem> = [];
  showPreloader: boolean = true;
  constructor(private contractsService: ContractsService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.getStatistics();
  }
  private getStatistics() {
    this.contractsService.getStatistics().subscribe((data: Array<ContractStatisticsItem>) => {
      this.list = data.map(item => new ContractStatisticsItem(item));
      this.showPreloader = false;
      this.cd.detectChanges();
    })
  }

}
