import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { ContractsFilterStatus } from '../class/contracts-filter-status';
import { ContractsFilterType } from '../class/contracts-filter-type';
import { ContractsFilter } from '../class/contracts-filter';
import { Subscription } from 'rxjs';
import { MultiDatepickerComponent } from '../../../shared/multi-datepicker/multi-datepicker.component';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { Company } from 'src/app/interfaces/company/company';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { ContractsFilterStatusComponent } from './contracts-filter-status/contracts-filter-status.component';

@Component({
  selector: 'app-contracts-filter',
  templateUrl: './contracts-filter.component.html',
  styleUrls: ['./contracts-filter.component.scss']
})
export class ContractsFilterComponent implements OnInit, OnDestroy {
  @Input() companyContracts: Company = null;
  @ViewChild('typesDp', { static: true }) typesDp: DropDownComponent;
  @ViewChild('companyDp', { static: true }) companyDp: CompanyDropDownComponent;
  @ViewChild('datesDp', { static: true }) datesDp: MultiDatepickerComponent;
  @ViewChild('statusDp', { static: true }) statusDp: ContractsFilterStatusComponent;
  @ViewChild('optionsDp', { static: true }) optionsDp: DropDownComponent;
  public contractsFilter: ContractsFilter = new ContractsFilter();
  listsOptions = [new ContractsFilterType('Manual create billable item', 'manualCreateBillableItem', null),
  new ContractsFilterType('Automatically create invoice', 'enableInvoiceAutoCreate', null)];
  listsTypes = [new ContractsFilterType('Hourly', 'HOURLY', null),
  new ContractsFilterType('Block Time', 'BLOCK_TIME', null),
  new ContractsFilterType('Service Contract/by device', 'SERVICE_CONTRACT', 'DEVICE'),
  new ContractsFilterType('Service Contract/by user', 'SERVICE_CONTRACT', 'USER'),
  new ContractsFilterType('Subscriptions', 'SERVICE_CONTRACT', 'OTHER')];
  listsStatus = []
  sub: Subscription = new Subscription();
  @Output() onClose = new EventEmitter<any>();
  constructor(private contractsStateService: ContractsStateService,
    private companiesState: CompaniesStateService,
    private customerPortalStateService: CustomerPortalStateService,
    public cd: ChangeDetectorRef,) { }
  ngOnInit() {
    if (this.companyContracts) {

      this.companyDp.editItem = this.companyContracts;
      this.companyDp.isDisabled = true;
      this.onSelectCompany(this.companyContracts);
      this.cd.detectChanges();
    }
    let onClearFitler = this.contractsStateService.onClearFitler.subscribe(res => {
      this.onClearAll();
    })
    this.sub.add(onClearFitler);
  }
  public onClearAll() {
    if (!this.companyContracts) {
      this.contractsFilter.setCompany(null);
      this.companyDp.clearWithOutChanges();
    }
    this.contractsFilter.setStatus([]);
    this.contractsFilter.setType(null);
    this.contractsFilter.resetDates();
    this.contractsFilter.clearOptions();
    this.typesDp.clearWithOutChanges();

    this.datesDp.clearWithOutChanges();
    this.statusDp.clearWithOutChanges();
    this.optionsDp.clearWithOutChanges();
    this.contractsStateService.setFilter(this.contractsFilter);
  }

  public onSelectOption(item) {
    this.contractsFilter.clearOptions();
    if (item) {
      if (item.type == 'manualCreateBillableItem') this.contractsFilter.setManualCreateBillableItem(true);
      if (item.type == 'enableInvoiceAutoCreate') this.contractsFilter.setEnableInvoiceAutoCreate(true);
    }
    // this.contractsStateService.setFilter(this.contractsFilter);
    // this.onChangeCounterFilter();
  }
  public onSelectCompany(item) {
    if (!item) {
      this.contractsFilter.setCompany(null);
    } else {
      this.contractsFilter.setCompany(item);
    }
    //  this.contractsStateService.setFilter(this.contractsFilter);
    // this.onChangeCounterFilter();
  }

  onSelectStatus(item) {
    if (!item) {
      this.contractsFilter.setStatus([]);
    } else {
      this.contractsFilter.setStatus(item);
    }
    //  this.contractsStateService.setFilter(this.contractsFilter);
    // this.onChangeCounterFilter();
  }
  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {
      this.contractsFilter.setStartDate(value.start);
      this.contractsFilter.setEndDate(value.end);
    } else {
      this.contractsFilter.resetDates();
    }
    //  this.contractsStateService.setFilter(this.contractsFilter);
    //  this.onChangeCounterFilter();
  }
  onSelectType(item) {
    if (!item) {
      this.contractsFilter.setType(null);
    } else {
      this.contractsFilter.setType(item);
    }
    //  this.contractsStateService.setFilter(this.contractsFilter);
    // this.onChangeCounterFilter();
  }
  public clearAll() {
    if (!this.companyDp.isDisabled) {
      this.contractsFilter.setCompany(null);
      this.companyDp.clearWithOutChanges();
    }
    this.contractsFilter.setType(null);
    this.contractsFilter.clearOptions();
    this.contractsFilter.resetDates();
    this.contractsFilter.setStatus([]);
    this.typesDp.clearWithOutChanges();
    this.optionsDp.clearWithOutChanges();
    this.datesDp.clearWithOutChanges();
    this.statusDp.clearWithOutChanges();
    this.contractsStateService.setFilter(this.contractsFilter);
  }
  applyFilters() {
    this.contractsStateService.setFilter(this.contractsFilter);
  }
  close() {
    this.onClose.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackByIndex(index, item) {
    return index;
  }
}
