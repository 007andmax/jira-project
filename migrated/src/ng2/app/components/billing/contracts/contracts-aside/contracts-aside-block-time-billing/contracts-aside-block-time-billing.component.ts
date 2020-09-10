import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsBlockTime } from '../class/contracts-block-time';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsBlockTimeService } from '../class/contracts-block-time-service';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import * as moment from "moment";

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
    private contractsService: ContractsService,
    private defaultServicesService: DefaultServicesService,
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
  onCheckDuplicatedCustomService () {
    if (this.contractsBlockTime.blockTimeServices.length === 0) return;
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsBlockTime.startDate).format('DD MMM YYYY'),
    moment(this.contractsBlockTime.endDate).format('DD MMM YYYY'), this.contractsBlockTime.companyId, null, this.contractsBlockTime.getBlockTimeServicesName()).subscribe(data => {
   
      if (Object.keys(data).length === 0) {
       
      } else {
        let names = Object.keys(data);
        console.log("names" ,names);
        this.contractsBlockTime.blockTimeServices.forEach(item => {
          let find  = names.find(name => name === item.name);
          if (find) item.validate = false;
        })
      }
    }, err => {

    })
  }
  addCustomService() {
    this.contractsBlockTime.blockTimeServices.push(new ContractsBlockTimeService("",5));
  }
  onRemoveCustomService(i) {
    this.contractsBlockTime.blockTimeServices.splice(i, 1);
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
    console.log("this.contractsBlockTime.includedHours",this.contractsBlockTime);
  }
  onChangeStartDate(data) {
    this.contractsBlockTime.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onChangeReviewDate(data) {
    this.contractsBlockTime.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
}
