import { Component, OnInit, ViewChild, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Company } from 'src/app/interfaces/company/company';
import { AppService } from 'src/app/states/app/app.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { ContractsFilterComponent } from '../contracts-filter/contracts-filter.component';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';
import { Subscription } from 'rxjs';
import { ContractsFilter } from '../class/contracts-filter';

@Component({
  selector: 'app-contracts-header',
  templateUrl: './contracts-header.component.html',
  styleUrls: ['./contracts-header.component.scss']
})
export class ContractsHeaderComponent implements OnInit, OnDestroy {
  @Input() companyContracts: Company = null;
  filter: ContractsFilter = new ContractsFilter();
  toggleFilter: boolean = false;
  countFilter: number = 0;
  sub: Subscription = new Subscription();
  constructor(private contractsStateService: ContractsStateService,
    public appService: AppService) { }


  ngOnInit() {
    /* let getFilter = this.contractsStateService.getFilter().subscribe(data => {
       this.sortBy.sortBy = 'COMPANY';
     })
     this.sub.add(getFilter);*/
    let onCloseFitler = this.contractsStateService.onToggleFitler.subscribe(res => {
      this.toggleFilter = res;
    })
    this.sub.add(onCloseFitler);
    let getFilter = this.contractsStateService.getFilter().subscribe(data => {
      this.filter.setFilters(data)
      this.onChangeCounterFilter();
    })
    this.sub.add(getFilter);
  }
  public onChangeCounterFilter() {
    this.countFilter = 0;
    if (this.filter.selectedCompany) this.countFilter++;
    if (this.filter.selectedType) this.countFilter++;
    if (this.filter.selectedStartDate && this.filter.selectedEndDate) this.countFilter++;
    if (this.filter.selectedStatus.length > 0) this.countFilter++;
    if (this.filter.enableInvoiceAutoCreate || this.filter.manualCreateBillableItem) this.countFilter++;

  }
  public showCreate() {
    this.contractsStateService.toggleCreate(true);
  }
  public onToggleFilters(data) {
    this.toggleFilter = data;
    this.contractsStateService.onToggleFitler.emit(data);
  }
  clearAll() {
    this.contractsStateService.onClearFitler.emit(null);
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
