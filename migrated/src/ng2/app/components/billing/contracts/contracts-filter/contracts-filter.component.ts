import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { SelectSearchComponent } from '../../../shared/select-search/select-search.component';
import { ContractsFilterStatus } from '../class/contracts-filter-status';
import { ContractsFilterType } from '../class/contracts-filter-type';
import { ContractsFilter } from '../class/contracts-filter';
import { Subscription } from 'rxjs';
import { MultiDatepickerComponent } from '../../../shared/multi-datepicker/multi-datepicker.component';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { Company } from 'src/ng2/app/interfaces/company/company';

@Component({
  selector: 'app-contracts-filter',
  templateUrl: './contracts-filter.component.html',
  styleUrls: ['./contracts-filter.component.scss']
})
export class ContractsFilterComponent implements OnInit, OnDestroy {
  @Input() companyContracts:Company = null;
  @ViewChild('typesDp') typesDp: DropDownComponent;
  @ViewChild('companyDp') companyDp: DropDownComponent;
  @ViewChild('datesDp') datesDp: MultiDatepickerComponent;
  @ViewChild('statusDp') statusDp: DropDownComponent;
  public contractsFilter: ContractsFilter = new ContractsFilter();
  companies = [];
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
    public cd: ChangeDetectorRef,) { }
  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
     
    if (this.companyContracts) {
      this.companyDp.editItem = this.companyContracts;
      this.companyDp.isDisabled = true;
      this.onSelectCompany(this.companyContracts);
       this.cd.detectChanges();
    }
  }
  public onClearAll() {
   if (!this.companyContracts) this.contractsFilter.setCompany(null);
    this.contractsFilter.setStatus(null);
    this.contractsFilter.setType(null);
    this.contractsFilter.resetDates();
    this.typesDp.clearWithOutChanges();
    this.companyDp.clearWithOutChanges();
    this.datesDp.clearWithOutChanges();
    this.statusDp.clearWithOutChanges();
    this.contractsStateService.setFilter(this.contractsFilter);
    this.onChangeCounterFilter();

  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.contractsFilter.selectedCompany) count++;
    if (this.contractsFilter.selectedType) count++;
    if (this.contractsFilter.selectedStartDate && this.contractsFilter.selectedEndDate) count++;
    if (this.contractsFilter.selectedStatus) count++;
    this.changeCountFilter.emit(count);
  }

  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
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
