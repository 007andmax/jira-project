import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContractStatisticsItem } from '../class/contracts-statistics-item';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { UserFilter } from 'src/app/components/users/class/user-filter';
import { ContractStatisticsFilter } from '../class/contracts-statistics-filter';

@Component({
  selector: 'contracts-statistics-table',
  templateUrl: './contracts-statistics-table.component.html',
  styleUrls: ['./contracts-statistics-table.component.scss']
})
export class ContractsStatisticsTableComponent implements OnInit {
  filter: ContractStatisticsFilter = new ContractStatisticsFilter();
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
  public onFilter(field) {
    this.filter.onFilter(field, this.list)

  }

}
