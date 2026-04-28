import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Company } from 'src/app/interfaces/company/company';
import { AppService } from 'src/app/states/app/app.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { ContractsFilterComponent } from '../contracts-filter/contracts-filter.component';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contracts-header',
  templateUrl: './contracts-header.component.html',
  styleUrls: ['./contracts-header.component.scss']
})
export class ContractsHeaderComponent implements OnInit, OnDestroy {
  @Input() companyContracts: Company = null;
  @ViewChild('filter', { static: true }) filter: ContractsFilterComponent;
  count = 0;
  toggleFilter: boolean = false;
  countFilter: number = 0;
  sortBy: TicketSortBy = new TicketSortBy('company', 'ASC');
  sub: Subscription = new Subscription();
  constructor(private contractsStateService: ContractsStateService,
    public appService: AppService) { }


  ngOnInit() {
    let getFilter = this.contractsStateService.getFilter().subscribe(data => {
      this.sortBy.sortBy = 'company';
    })
    this.sub.add(getFilter);
    let onSortDiraction = this.contractsStateService.onSortDiraction.subscribe(data => {
      this.sortBy.sortDirection = data;
    })
    this.sub.add(onSortDiraction);
  }
  public showCreate() {
    this.contractsStateService.toggleCreate(true);
  }
  public setSort(name) {
    this.sortBy.sortBy = name;
    this.contractsStateService.setSort(name);
  }
  clearAll() {
    this.filter.onClearAll();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
