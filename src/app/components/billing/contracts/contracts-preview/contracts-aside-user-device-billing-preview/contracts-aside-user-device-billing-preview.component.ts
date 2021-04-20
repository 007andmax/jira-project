import { Component, Input, OnInit } from '@angular/core';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Tax } from 'src/class/taxes/tax';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ServiceAgreement } from '../../class/service-agreement';
import * as moment from "moment";

@Component({
  selector: 'app-contracts-aside-user-device-billing-preview',
  templateUrl: './contracts-aside-user-device-billing-preview.component.html',
  styleUrls: ['./contracts-aside-user-device-billing-preview.component.scss']
})
export class ContractsAsideUserDeviceBillingPreviewComponent implements OnInit {
  selectedCompany: any;
  selectedTaxes = [];
  taxes: Array<Tax> = [];
  selectedType = new ContractsFilterType('Service Contract/by device/by user', 'SERVICE_CONTRACT_DEVICE_USER', null);
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  @Input() contractsUserDevice: ServiceAgreement = new ServiceAgreement();
  formatDate: string = FORMAT_DATE_2;
  toggleContractServices: boolean = false;
  constructor(private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,
    private taxesStateService: TaxesStateService,
  ) { }

  ngOnInit() {
  }
  ngDoCheck() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsUserDevice.companyId);
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
    });
    this.getSelectedInterval();
    this.toggleContractServices = (this.contractsUserDevice.services.length > 0);

  }
  getSelectedInterval() {
    if (this.contractsUserDevice.interval) {
      this.selectedInterval = this.contractsUserDevice.interval;
    } else {
      this.selectedInterval = (this.contractsUserDevice.customInterval === 30) ? '30 days' : (this.contractsUserDevice.customInterval === 15) ? '15 days' : '7 days';
    }
  }
  parsedateForTotal(date) {
    return moment(date).format('DD MMM YYYY');
  }
  getSelectedTaxes(taxes) {
    let selectedTax = [];
    this.taxes.forEach(item => {
      let find = taxes.find(id => id === item.id);
      if (find) selectedTax.push(item);
    })
    return selectedTax.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join(",");
  }
  public trackById(index, item) {
    return item.id;
  }
}
