import { Component, Input, OnInit } from '@angular/core';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { Tax } from 'src/ng2/app/interfaces/service/tax';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ServiceAgreement } from '../../class/service-agreement';
import * as moment from "moment";
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

@Component({
  selector: 'app-contracts-aside-block-time-billing-preview',
  templateUrl: './contracts-aside-block-time-billing-preview.component.html',
  styleUrls: ['./contracts-aside-block-time-billing-preview.component.scss']
})
export class ContractsAsideBlockTimeBillingPreviewComponent implements OnInit {

  selectedCompany: any;
  selectedTaxes = [];
  taxes: Array<Tax> = [];
  selectedType = new ContractsFilterType('Block Time', 'BLOCK_TIME', null);
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  @Input() contractsBlockTime: ServiceAgreement = new ServiceAgreement();
  formatDate: string = FORMAT_DATE_2;
  toggleTimeRollover: boolean = false;

  constructor(private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,
    private taxesStateService: TaxesStateService,
  ) { }

  ngOnInit() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsBlockTime.companyId);
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
    });
    this.getSelectedInterval();
    if (this.contractsBlockTime.maxRolloverHours) this.toggleTimeRollover = true;
  
  }
  getSelectedInterval() {
    if (this.contractsBlockTime.interval) {
      this.selectedInterval = this.contractsBlockTime.interval;
    } else {
      this.selectedInterval = (this.contractsBlockTime.customInterval === 30) ? '30 days' : (this.contractsBlockTime.customInterval === 15) ? '15 days' : '7 days';
    }
  }
  getIntervalText() {
    return this.selectedInterval.toLowerCase();
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
  parseWithFixed(value) {
    return parseFloat(value).toFixed(2);
  }
  public getUser(id) {
    return this.usersStateService.getAllUsers().find(item => item.id === id);
  }
  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  getStyleAvatar(user) {
    if (!(user && user.avatar)) {
      return '#16a4fa';
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) no-repeat`;
    } else {
      return '#16a4fa';
    }
  };
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
}
