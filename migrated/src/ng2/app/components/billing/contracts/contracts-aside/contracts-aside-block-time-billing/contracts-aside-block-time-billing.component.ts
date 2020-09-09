import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsBlockTime } from '../class/contracts-block-time';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';


@Component({
  selector: 'app-contracts-aside-block-time-billing',
  templateUrl: './contracts-aside-block-time-billing.component.html',
  styleUrls: ['./contracts-aside-block-time-billing.component.scss']
})
export class ContractsAsideBlockTimeBillingComponent implements OnInit {
  selectedType = new ContractsFilterType('Block Time', 'BLOCK_TIME', null);
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  minStartDate: number = null;
  formatDate: string = FORMAT_DATE_2;
  today = new Date().getTime();
  contractsBlockTime: ContractsBlockTime = new ContractsBlockTime();
  constructor(private companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    let today = new Date();
    today.setMonth(today.getMonth() + 1);
    this.contractsBlockTime.setStartDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsBlockTime.setReviewDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

    this.minStartDate = this.getMinStartDate('MONTHLY', this.contractsBlockTime.startDate);
    console.log("this.minStartDate", this.minStartDate);
  }
  getMinStartDate(interval, startDate) {
    let newMinStartDate;
    let now = new Date(startDate);
    let n = new Date(now);
    let day = 1000 * 60 * 60 * 24;
    if (interval === 'MONTHLY') {
      n.setMonth(n.getMonth() - 1);
      newMinStartDate = n.getTime() + day;
    } else if (interval === 'YEARLY') {
      n.setFullYear(n.getFullYear() - 1);
      newMinStartDate = n.getTime() + day;
    } else if (interval === '30 days') {
      newMinStartDate = now.getTime() - (29 * day);
    } else if (interval === '15 days') {
      newMinStartDate = now.getTime() - (14 * day);
    } else if (interval === '7 days') {
      newMinStartDate = now.getTime() - (6 * day);
    }
    return newMinStartDate;
  }

  onChangeIncludedBlockTime(event) {
    this.contractsBlockTime.includedHours = event.target.value;
  }
  onChangeBlockRate(event) {
    this.contractsBlockTime.blockRate = event.target.value;
  }
  onChangeRateExceeding(event) {
    this.contractsBlockTime.rateExceeding = event.target.value;
  }
  onSelectCompany(data) {
    this.contractsBlockTime.setCompanyId((data) ? data.id : null);
  }
  onTaxesChange(data) {
    this.contractsBlockTime.taxIds = data.map(item => item.id);
  }
  onSelectInterval(data) {
    this.selectedInterval = data;
    this.minStartDate = this.getMinStartDate(data, this.contractsBlockTime.startDate);
    console.log("this.minStartDate", this.minStartDate);
    this.cd.detectChanges();
  }
  onChangeStartDate(data) {
    this.contractsBlockTime.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onChangeReviewDate(data) {
    this.contractsBlockTime.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
}
