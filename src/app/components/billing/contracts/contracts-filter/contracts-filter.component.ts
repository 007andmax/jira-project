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

@Component({
  selector: 'app-contracts-filter',
  templateUrl: './contracts-filter.component.html',
  styleUrls: ['./contracts-filter.component.scss']
})
export class ContractsFilterComponent implements OnInit, OnDestroy {
  @Input() companyContracts: Company = null;
  @ViewChild('typesDp') typesDp: DropDownComponent;
  @ViewChild('companyDp') companyDp: CompanyDropDownComponent;
  @ViewChild('datesDp') datesDp: MultiDatepickerComponent;
  @ViewChild('statusDp') statusDp: DropDownComponent;
  @ViewChild('optionsDp') optionsDp: DropDownComponent;
  public contractsFilter: ContractsFilter = new ContractsFilter();
  listsOptions = [new ContractsFilterType('Manual create billable item', 'manualCreateBillableItem', null),
  new ContractsFilterType('Automatically create invoice', 'enableInvoiceAutoCreate', null)];
  listsTypes = [new ContractsFilterType('Hourly', 'HOURLY', null),
  new ContractsFilterType('Block Time', 'BLOCK_TIME', null),
  new ContractsFilterType('Service Contract/by device', 'SERVICE_CONTRACT', 'DEVICE'),
  new ContractsFilterType('Service Contract/by user', 'SERVICE_CONTRACT', 'USER'),
  new ContractsFilterType('Subscriptions', 'SERVICE_CONTRACT', 'OTHER')];
  listsStatus = [new ContractsFilterStatus('Current', 'CURRENT'),
  new ContractsFilterStatus('Pending', 'PENDING'),
  new ContractsFilterStatus('Terminated', 'TERMINATED'),
  new ContractsFilterStatus('Expired', 'EXPIRED')]
  sub: Subscription = new Subscription();
  @Output() changeCountFilter = new EventEmitter<any>();
  constructor(private contractsStateService: ContractsStateService,
    private companiesState: CompaniesStateService,
    private customerPortalStateService: CustomerPortalStateService,
    public cd: ChangeDetectorRef,) { }
  ngOnInit() {
    if (this.customerPortalStateService.isCustomerPortal && this.companiesState.getCompanies().length > 0) this.checkCompanyCustomerUser();
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      if (this.customerPortalStateService.isCustomerPortal) this.checkCompanyCustomerUser();
    })
    this.sub.add(getOnCompanies);
    if (this.companyContracts) {
      this.companyDp.editItem = this.companyContracts;
      this.companyDp.isDisabled = true;
      this.onSelectCompany(this.companyContracts);
      this.cd.detectChanges();
    }
  }
  private checkCompanyCustomerUser() {
    this.contractsFilter.setFilters(JSON.parse(JSON.stringify(this.contractsStateService.getContractsFilter())));
    this.companyContracts = this.companiesState.getCompanies().find(item => item.id == localStorage.getItem('company_info_id'));
    this.companyDp.selectItemWithOutChanges(this.companyContracts);
    this.companyDp.isDisabled = true;
  }
  public onClearAll() {
    if (!this.companyContracts) this.contractsFilter.setCompany(null);
    this.contractsFilter.setStatus(null);
    this.contractsFilter.setType(null);
    this.contractsFilter.resetDates();
    this.contractsFilter.clearOptions();
    this.typesDp.clearWithOutChanges();
    this.companyDp.clearWithOutChanges();
    this.datesDp.clearWithOutChanges();
    this.statusDp.clearWithOutChanges();
    this.optionsDp.clearWithOutChanges();
    this.contractsStateService.setFilter(this.contractsFilter);
    this.onChangeCounterFilter();

  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.contractsFilter.selectedCompany) count++;
    if (this.contractsFilter.selectedType) count++;
    if (this.contractsFilter.selectedStartDate && this.contractsFilter.selectedEndDate) count++;
    if (this.contractsFilter.selectedStatus) count++;
    if (this.contractsFilter.enableInvoiceAutoCreate || this.contractsFilter.manualCreateBillableItem) count++;
    this.changeCountFilter.emit(count);
  }
  public onSelectOption(item) {
    this.contractsFilter.clearOptions();
    if (item) {
      if (item.type == 'manualCreateBillableItem') this.contractsFilter.setManualCreateBillableItem(true);
      if (item.type == 'enableInvoiceAutoCreate') this.contractsFilter.setEnableInvoiceAutoCreate(true);
    }
    this.contractsStateService.setFilter(this.contractsFilter);
    this.onChangeCounterFilter();
  }
  public onSelectCompany(item) {
    if (!item) {
      this.contractsFilter.setCompany(null);
    } else {
      this.contractsFilter.setCompany(item);
    }
    this.contractsStateService.setFilter(this.contractsFilter);
    this.onChangeCounterFilter();
  }

  onSelectStatus(item) {
    if (!item) {
      this.contractsFilter.setStatus(null);
    } else {
      this.contractsFilter.setStatus(item);
    }
    this.contractsStateService.setFilter(this.contractsFilter);
    this.onChangeCounterFilter();
  }
  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {
      this.contractsFilter.setStartDate(value.start);
      this.contractsFilter.setEndDate(value.end);
    } else {
      this.contractsFilter.resetDates();
    }
    this.contractsStateService.setFilter(this.contractsFilter);
    this.onChangeCounterFilter();
  }
  onSelectType(item) {
    if (!item) {
      this.contractsFilter.setType(null);
    } else {
      this.contractsFilter.setType(item);
    }
    this.contractsStateService.setFilter(this.contractsFilter);
    this.onChangeCounterFilter();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackByIndex(index, item) {
    return index;
  }
}
