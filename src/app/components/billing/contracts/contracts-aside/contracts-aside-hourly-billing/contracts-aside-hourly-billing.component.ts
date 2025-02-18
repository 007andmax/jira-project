import { Component, OnInit, EventEmitter, Output, ViewChild, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { ContractsHourly } from '../class/contracts-hourly';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { ContractsHourlyValidate } from '../class/contracts-hourly-validate';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import * as moment from "moment";
import { DefaultServicesHourlyContract } from '../class/default-service-hourly-contract';
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { Tax } from 'src/app/interfaces/service/tax';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
import { ContractsAsideTopComponent } from '../contracts-aside-top/contracts-aside-top.component';
import { Subscription } from 'rxjs';
import { ContractsAsideHourlyBillingDefaultServiceComponent } from './contracts-aside-hourly-billing-default-service/contracts-aside-hourly-billing-default-service.component';
@Component({
  selector: 'app-contracts-aside-hourly-billing',
  templateUrl: './contracts-aside-hourly-billing.component.html',
  styleUrls: ['./contracts-aside-hourly-billing.component.scss']
})
export class ContractsAsideHourlyBillingComponent implements OnInit, OnDestroy {
  @Output() onInitRequestForAdd = new EventEmitter<any>();
  @ViewChild('startDateDP', { static: true }) startDateDP: DatePickerComponent;
  @ViewChild('reviewDateDP', { static: true }) reviewDateDP: DatePickerComponent;
  @ViewChild('topContract', { static: true }) topContract: ContractsAsideTopComponent;
  @ViewChildren("serviceItem") serviceItems: QueryList<ContractsAsideHourlyBillingDefaultServiceComponent>;
  validate: ContractsHourlyValidate = new ContractsHourlyValidate();
  defaultServices: Array<DefaultServicesHourlyContract> = [];
  selectedType = new ContractsFilterType('Hourly', 'HOURLY', null);
  contractsHourly: ContractsHourly = new ContractsHourly();
  formatDate: string = FORMAT_DATE_2;
  startDate = new Date().getTime();
  reviewDate = new Date().getTime();
  showAddService: boolean = false;
  selectAllServices: boolean = true;
  taxes: Array<Tax> = [];
  sub: Subscription = new Subscription();
  @Output() onClose = new EventEmitter<any>();
  constructor(private companiesStateService: CompaniesStateService,
    private contractsService: ContractsService,
    private taxesStateService: TaxesStateService,
    private nonContractServicesService: NonContractServicesService,
    private contractsStateService: ContractsStateService,) { }


  ngOnInit() {
    let today = new Date();
    let reviewDate = new Date();
    reviewDate.setFullYear(reviewDate.getFullYear() + 1);
    this.reviewDate = reviewDate.getTime();
    today.setMonth(today.getMonth() + 1);
    this.contractsHourly.setStartDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsHourly.setReviewDate(today.getDate(), today.getMonth(), today.getFullYear() + 1, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
    })
    this.sub.add(getOnTaxess);
    if (this.contractsStateService.getContractForCopy()) {
      this.onInitCopy();
    } else {
      if (this.contractsStateService.getDefaultService().length > 0) this.setDefaultServices(this.contractsStateService.getDefaultService());
      this.contractsStateService.getOnDefaultServices().subscribe(data => {
        this.setDefaultServices(data);
      })
    }
  }
  public setDefaultServices(data) {
    this.defaultServices = data.map(item => {
      let service = new DefaultServicesHourlyContract(item);
      service.selected = true;
      return service;
    });
    this.defaultServices.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  public onInitCopy() {
    this.contractsHourly.setDataFromCopy(this.contractsStateService.getContractForCopy());
    this.contractsHourly.services.forEach(item => {
      let service = new DefaultServicesHourlyContract();
      service.setDataFromCopy(item, this.taxes);
      this.defaultServices.push(service);
    })
    this.selectAllServices = true;
    this.startDate = this.contractsStateService.getContractForCopy().getStartDateByMilliseconds();
    this.startDateDP.minDate = this.contractsStateService.getContractForCopy().getStartDateByMilliseconds();
    this.reviewDate = this.contractsStateService.getContractForCopy().getReviewDateByMilliseconds();
    this.reviewDateDP.minDate = this.contractsStateService.getContractForCopy().getReviewDateByMilliseconds();
    this.startDateDP.setEditDate(this.contractsStateService.getContractForCopy().getStartDateByMilliseconds());
    this.reviewDateDP.setEditDate(this.contractsStateService.getContractForCopy().getReviewDateByMilliseconds());
    this.topContract.companiesDP.selectedItem = this.companiesStateService.getCompanies().find(item => item.id === this.contractsHourly.companyId);
  }
  public onCreate() {
    this.contractsHourly.onAddServices(this.defaultServices);
    if (this.contractsHourly.services.length === 0 || !this.validate.isValidate(this.contractsHourly) || !this.validate.isValidateRateServices(this.defaultServices)) return;
    this.contractsService.validateCrossingDatesHourly(moment(this.contractsHourly.startDate).format('DD MMM YYYY'), moment(this.contractsHourly.endDate).format('DD MMM YYYY'), this.contractsHourly.companyId, null).subscribe((data: any) => {
      if (data.valid) {
        this.validate.resetDate();
        this.searchDuplicatedServiceNames();
      } else {

        this.validate.setDate(false);
      }
    })
  }
  public searchDuplicatedServiceNames() {
    let servicesName = this.contractsHourly.services.map(item => item.name);
    this.nonContractServicesService.searchDuplicatedServiceNames(moment(this.contractsHourly.startDate).format('DD MMM YYYY'),
      moment(this.contractsHourly.endDate).format('DD MMM YYYY'), this.contractsHourly.companyId, null, servicesName).subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.onInitRequestForAdd.emit(null);
          this.contractsService.createContract(false, this.contractsHourly.getDataForCreate()).subscribe(contract => {
            this.onClose.emit(null);
          })
        } else {
          let names = Object.keys(data);
          this.defaultServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) {
              item.validate = false;
              item.descriptionValidate = data[item.name];
            }
          })
        }
      }, err => {

      })
  }
  onToggleAllServices(event) {

    this.defaultServices.forEach(item => {
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
  onSelectService() {
    this.selectAllServices = true;
    this.defaultServices.forEach(item => {
      if (!item.selected) {
        this.selectAllServices = false;
      }
    })
  }
  onChangeDescription() {
    this.validate.resetDescription();
  }
  onAddService(data) {
    this.defaultServices.push(new DefaultServicesHourlyContract(data));
    this.showAddService = false;
    console.log("this.defaultServices", this.defaultServices);
  }
  onSelectCompany(data) {
    this.contractsHourly.setCompanyId((data) ? data.id : null);
    if (data) {
      this.validate.resetCompany();
      this.validate.resetDate();
    }
  }
  onChangeStartDate(data) {
    this.contractsHourly.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.validate.resetDate();
  }
  onChangeReviewDate(data) {
    this.contractsHourly.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
