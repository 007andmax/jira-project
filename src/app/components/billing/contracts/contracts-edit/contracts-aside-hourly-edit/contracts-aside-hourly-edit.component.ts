import { Component, OnInit, Input, Output, EventEmitter, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ServiceAgreement } from '../../class/service-agreement';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { ContractsHourlyValidate } from '../../contracts-aside/class/contracts-hourly-validate';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DefaultServicesHourlyContract } from '../../contracts-aside/class/default-service-hourly-contract';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import * as moment from "moment";
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { ContractsBlockTimeDefaultService } from '../../contracts-aside/class/contracts-block-time-default-service';
import { ContractsAsideHourlyBillingDefaultServiceComponent } from '../../contracts-aside/contracts-aside-hourly-billing/contracts-aside-hourly-billing-default-service/contracts-aside-hourly-billing-default-service.component';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
@Component({
  selector: 'app-contracts-aside-hourly-edit',
  templateUrl: './contracts-aside-hourly-edit.component.html',
  styleUrls: ['./contracts-aside-hourly-edit.component.scss']
})
export class ContractsAsideHourlyEditComponent implements OnInit {
  selectedCompany: any;
  selectedTaxes = [];
  selectedType = new ContractsFilterType('Hourly', 'HOURLY', null);
  validate: ContractsHourlyValidate = new ContractsHourlyValidate();
  @Input() contractsHourly: ServiceAgreement = new ServiceAgreement();
  @Output() onClose = new EventEmitter<any>();
  @ViewChild('reviewDateDP', { static: true }) reviewDateDP: DatePickerComponent;
  @ViewChild('endDateDP', { static: true }) endDateDP: DatePickerComponent;
  @ViewChildren("serviceItem", { emitDistinctChangesOnly: false }) serviceItems: QueryList<ContractsAsideHourlyBillingDefaultServiceComponent>;
  formatDate: string = FORMAT_DATE_2;
  showAddService: boolean = false;
  selectAllServices: boolean = true;
  constructor(private companiesStateService: CompaniesStateService,
    private contractsService: ContractsService,
    private nonContractServicesService: NonContractServicesService,
    private contractsStateService: ContractsStateService,
  ) { }

  ngOnInit() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsHourly.companyId);
  }
  public onEdit() {
    if (this.contractsHourly.services.filter(item => item.selected).length === 0 || !this.validate.isValidate(this.contractsHourly) || !this.validate.isValidateRateServices(this.contractsHourly.services)) return;
    this.contractsService.validateCrossingDatesHourly(moment(this.contractsHourly.startDate).format('DD MMM YYYY'), (!this.contractsHourly.isPerpetual) ? moment(this.contractsHourly.endDate).format('DD MMM YYYY') : null, this.contractsHourly.companyId, this.contractsHourly.id).subscribe((data: any) => {
      if (data.valid) {
        this.validate.resetDate();
        this.searchDuplicatedServiceNames();
      } else {
        this.validate.setDate(false);
      }
    })
  }
  public searchDuplicatedServiceNames() {
    let servicesName = this.contractsHourly.services.filter(item => item.selected).map(item => item.name);
    this.nonContractServicesService.searchDuplicatedServiceNames(moment(this.contractsHourly.startDate).format('DD MMM YYYY'),
      (!this.contractsHourly.isPerpetual) ? moment(this.contractsHourly.endDate).format('DD MMM YYYY') : null, this.contractsHourly.companyId, this.contractsHourly.id, servicesName).subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.contractsService.updateContract(this.contractsHourly.getDataForUpdateHourly()).subscribe(contract => {
            this.contractsStateService.fastEditContract(contract);
            this.onClose.emit(null);
          })
        }
      }, err => {

      })
  }
  onAddService(data: DefaultServicesHourlyContract) {
    this.contractsHourly.services.push(new ContractsBlockTimeDefaultService(true, data.billable, data.commissionRate, data.versionedId.id, data.name, data.rate, data.taxes.map(item => item.id), data.parentDefaultServiceId, true, data.discountAmount, data.discountType));
    this.showAddService = false;
  }
  onToggleAllServices(event) {
    this.contractsHourly.services.forEach(item => {
      item.selected = event.target.checked;
      if (!event.target.checked) {
        item.billable = false;
        item.rate = 0;
        item.rate_str = "0.00";
        this.serviceItems.toArray().forEach(item => {
          item.resetRate();
        })
      }
    })
    this.selectAllServices = event.target.checked;
  }
  onChangeDescription() {
    this.validate.resetDescription();
  }
  onSelectService() {
    this.selectAllServices = true;
    this.contractsHourly.services.forEach(item => {
      if (!item.selected) {
        this.selectAllServices = false;
        item.validateRate = true;
      }
    })
  }
  onChangeStartDate(data) {
    this.contractsHourly.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.endDateDP.setEditDate(this.contractsHourly.getEndDateByMilliseconds());
    this.validate.resetDate();
    this.contractsHourly.calculateReviewDate();
    this.reviewDateDP.setEditDate(this.contractsHourly.getReviewDateByMilliseconds());
  }
  onChangeEndDate(data) {
    this.contractsHourly.setEndDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsHourly.calculateReviewDate();
    this.reviewDateDP.setEditDate(this.contractsHourly.getReviewDateByMilliseconds());
  }
  onChangeReviewDate(data) {
    this.contractsHourly.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  setTogglePerpetual(data) {
    this.contractsHourly.isPerpetual = data;
  }
  public trackById(index, item) {
    return item.id;
  }
}
