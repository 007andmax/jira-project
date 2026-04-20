import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContractStatisticsItem } from '../class/contracts-statistics-item';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { ContractStatisticsFilter } from '../class/contracts-statistics-filter';
import { ContractsStatisticsTableItemComponent } from './contracts-statistics-table-item/contracts-statistics-table-item.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'contracts-statistics-table',
    templateUrl: './contracts-statistics-table.component.html',
    styleUrls: ['./contracts-statistics-table.component.scss'],
    standalone: true,
    imports: [NgFor, ContractsStatisticsTableItemComponent, NgIf]
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
  /**
  * @description Init request to get contracts list statistics
  */
  private getStatistics() {
    this.contractsService.getStatistics().subscribe((data: Array<ContractStatisticsItem>) => {
      this.list = data.map(item => new ContractStatisticsItem(item));
      this.showPreloader = false;
      this.cd.detectChanges();
    })
  }
  /**
  * @description Init logic to sort list contracts
  * @param  {String} field  - value of field
  */
  public onFilter(field) {
    this.filter.onFilter(field, this.list)
  }

  public trackById(index, item) {
    return item.id;
  }
}
