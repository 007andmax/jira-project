import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContractStatisticsItem } from '../class/contracts-statistics-item';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { ContractStatisticsFilter } from '../class/contracts-statistics-filter';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';

@Component({
  selector: 'contracts-statistics-table',
  templateUrl: './contracts-statistics-table.component.html',
  styleUrls: ['./contracts-statistics-table.component.scss']
})
export class ContractsStatisticsTableComponent implements OnInit {
  filter: ContractStatisticsFilter = new ContractStatisticsFilter();
  list: Array<ContractStatisticsItem> = [];
  showPreloader: boolean = true;
  sortBy: TicketSortBy = new TicketSortBy('company-name', 'ASC');
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
      this.list.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
        1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      this.cd.detectChanges();
    })
  }
  /**
  * @description Init logic to sort list contracts
  * @param  {String} field  - value of field
  */
  public onFilter(field) {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.sortBy.sortBy = field;
    this.filter.onFilter(field, this.list)
    this.sortBy.sortDirection = this.filter.direction;
  }

  public trackById(index, item) {
    return item.id;
  }
}
