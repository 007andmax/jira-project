import { Component, OnInit, Input } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsHourly } from '../class/contracts-hourly';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { DefaultServices } from '../../../default-services/class/default-service';

@Component({
  selector: 'app-contracts-aside-hourly-billing',
  templateUrl: './contracts-aside-hourly-billing.component.html',
  styleUrls: ['./contracts-aside-hourly-billing.component.scss']
})
export class ContractsAsideHourlyBillingComponent implements OnInit {
  defaultServices: Array<DefaultServices> = [];
  selectedType = new ContractsFilterType('Hourly', 'HOURLY', null);
  contractsHourly: ContractsHourly = new ContractsHourly();
  formatDate: string = FORMAT_DATE_2;
  today = new Date().getTime();
  showAddService:boolean = false;
  constructor(private companiesStateService: CompaniesStateService,
    private contractsStateService: ContractsStateService,) { }

  ngOnInit() {
    let today = new Date();
    this.contractsHourly.setStartDate(today.getDate(), today.getMonth() + 1, today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsHourly.setReviewDate(today.getDate(), today.getMonth() + 1, today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

    if (this.contractsStateService.getDefaultService().length > 0) this.defaultServices = this.contractsStateService.getDefaultService();
    this.contractsStateService.getOnDefaultServices().subscribe(data => {
      this.defaultServices = data;
    })
  }
  onAddService(data) {
    this.defaultServices.push(new DefaultServices(data));
    this.showAddService = false;
  }
  onSelectCompany(data) {
    this.contractsHourly.setCompanyId((data) ? data.id : null);
  }
  onChangeStartDate(data) {
    this.contractsHourly.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onChangeReviewDate(data) {
    this.contractsHourly.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
}
