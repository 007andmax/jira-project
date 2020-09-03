import { Component, OnInit, Input } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsHourly } from '../class/contracts-hourly';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';

@Component({
  selector: 'app-contracts-aside-hourly-billing',
  templateUrl: './contracts-aside-hourly-billing.component.html',
  styleUrls: ['./contracts-aside-hourly-billing.component.scss']
})
export class ContractsAsideHourlyBillingComponent implements OnInit {
  defaultServices:any = [];
  selectedType = new ContractsFilterType('Hourly', 'HOURLY', null);
  contractsHourly: ContractsHourly = new ContractsHourly();
  formatDate: string = FORMAT_DATE_2;
  today = new Date().getTime();
  constructor(private companiesStateService: CompaniesStateService,
    private contractsStateService: ContractsStateService,) { }

  ngOnInit() {
    if (this.contractsStateService.getDefaultService().length > 0) this.defaultServices = this.contractsStateService.getDefaultService();
    this.contractsStateService.getOnDefaultServices().subscribe(data => {
      this.defaultServices = data;
    })
  }
  onChangeStartDate(data) {
    this.contractsHourly.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onChangeReviewDate(data) {
    this.contractsHourly.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
}
