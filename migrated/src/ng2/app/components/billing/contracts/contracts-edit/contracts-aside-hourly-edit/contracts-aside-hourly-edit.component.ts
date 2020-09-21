import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ServiceAgreement } from '../../class/service-agreement';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsHourlyValidate } from '../../contracts-aside/class/contracts-hourly-validate';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsHourlyService } from '../../contracts-aside/class/contracts-hourly-service';
import { DefaultServicesHourlyContract } from '../../contracts-aside/class/default-service-hourly-contract';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import * as moment from "moment";
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { ContractsBlockTimeDefaultService } from '../../contracts-aside/class/contracts-block-time-default-service';
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
  formatDate: string = FORMAT_DATE_2;
  showAddService: boolean = false;
  selectAllServices: boolean = true;
  constructor(private companiesStateService: CompaniesStateService,
    private contractsService: ContractsService,
    private contractsStateService: ContractsStateService,
    private defaultServicesService: DefaultServicesService,
  ) { }

  ngOnInit() {
    console.log("contractsHourly", this.contractsHourly);
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsHourly.companyId);
    

  }
  public onEdit() {
    //this.contractsHourly.onAddServices(this.defaultServices);
    if (this.contractsHourly.services.filter(item => item.selected).length === 0 || !this.validate.isValidate(this.contractsHourly)) return;
    this.contractsService.validateCrossingDatesHourly(moment(this.contractsHourly.startDate).format('DD MMM YYYY'), moment(this.contractsHourly.endDate).format('DD MMM YYYY'), this.contractsHourly.companyId, this.contractsHourly.id).subscribe((data: any) => {
      if (data.valid) {
        this.validate.resetDate();
        this.searchDuplicatedServiceNames();
      } else {

        this.validate.setDate(false);
      }
    })
  }
  public searchDuplicatedServiceNames() {
    let servicesName = this.contractsHourly.services.filter(item =>  item.selected).map(item =>  item.name);
    console.log("servicesName", servicesName);
    console.log("this.contractsHourly.services", this.contractsHourly.services);
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsHourly.startDate).format('DD MMM YYYY'),
      moment(this.contractsHourly.endDate).format('DD MMM YYYY'), this.contractsHourly.companyId, this.contractsHourly.id, servicesName).subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.contractsService.updateContract(this.contractsHourly.getDataForUpdateHourly()).subscribe(contract => {
            this.onClose.emit(null);
          })
        } else {

        }
      }, err => {

      })
  }
  onAddService(data: DefaultServicesHourlyContract) {
    console.log("data", data);
    this.contractsHourly.services.push(new ContractsBlockTimeDefaultService(true, data.billable, data.commissionRate, data.versionedId.id, data.name, data.rate, data.taxes.map(item => item.id)));
    this.showAddService = false;
    console.log("this.contractsHourly.services", this.contractsHourly.services);
  }
  onToggleAllServices(event) {

    this.contractsHourly.services.forEach(item => {
      item.selected = event.target.checked;
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
      }
    })
  }
  onChangeStartDate(data) {
    this.contractsHourly.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.validate.resetDate();
  }
  onChangeReviewDate(data) {
    this.contractsHourly.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
}
