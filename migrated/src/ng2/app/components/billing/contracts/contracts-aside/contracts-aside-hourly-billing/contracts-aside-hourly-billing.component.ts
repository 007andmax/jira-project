import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsHourly } from '../class/contracts-hourly';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { DefaultServices } from '../../../default-services/class/default-service';
import { ContractsHourlyValidate } from '../class/contracts-hourly-validate';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import * as moment from "moment";
import { DefaultServicesHourlyContract } from '../class/default-service-hourly-contract';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
@Component({
  selector: 'app-contracts-aside-hourly-billing',
  templateUrl: './contracts-aside-hourly-billing.component.html',
  styleUrls: ['./contracts-aside-hourly-billing.component.scss']
})
export class ContractsAsideHourlyBillingComponent implements OnInit {
  validate: ContractsHourlyValidate = new ContractsHourlyValidate();
  defaultServices: Array<DefaultServicesHourlyContract> = [];
  selectedType = new ContractsFilterType('Hourly', 'HOURLY', null);
  contractsHourly: ContractsHourly = new ContractsHourly();
  formatDate: string = FORMAT_DATE_2;
  today = new Date().getTime();
  showAddService: boolean = false;
  selectAllServices: boolean = false;
  @Output() onClose = new EventEmitter<any>();
  constructor(private companiesStateService: CompaniesStateService,
    private contractsService: ContractsService,
    private defaultServicesService: DefaultServicesService,
    private contractsStateService: ContractsStateService,) { }

  ngOnInit() {
    let today = new Date();
    this.contractsHourly.setStartDate(today.getDate(), today.getMonth() + 1, today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsHourly.setReviewDate(today.getDate(), today.getMonth() + 1, today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

    if (this.contractsStateService.getDefaultService().length > 0) this.defaultServices = this.contractsStateService.getDefaultService();
    this.contractsStateService.getOnDefaultServices().subscribe(data => {
      this.defaultServices = data.map(item => new DefaultServicesHourlyContract(item));
    })
  }
  public onCreate() {
    this.contractsHourly.onAddServices(this.defaultServices);
    if (this.contractsHourly.services.length === 0 || !this.validate.isValidate(this.contractsHourly)) return;
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
    let servicesName =  this.contractsHourly.services.map(item =>  item.name);
    console.log("servicesName",servicesName);
    console.log("this.contractsHourly.services",this.contractsHourly.services);
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsHourly.startDate).format('DD MMM YYYY'),
      moment(this.contractsHourly.endDate).format('DD MMM YYYY'), this.contractsHourly.companyId, null, servicesName).subscribe(data => {
        if (Object.keys(data).length === 0) {
         this.contractsService.createContract(false,this.contractsHourly.getDataForCreate()).subscribe(contract => {
 this.onClose.emit(null);
         })
        } else {
         
        }
      }, err => {
       
      })
  }
  onToggleAllServices(event) {
  
    this.defaultServices.forEach(item => {
      item.selected = event.target.checked;
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
  }
  onSelectCompany(data) {
    this.contractsHourly.setCompanyId((data) ? data.id : null);
  }
  onChangeStartDate(data) {
    this.contractsHourly.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.validate.resetDate();
  }
  onChangeReviewDate(data) {
    this.contractsHourly.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
}
