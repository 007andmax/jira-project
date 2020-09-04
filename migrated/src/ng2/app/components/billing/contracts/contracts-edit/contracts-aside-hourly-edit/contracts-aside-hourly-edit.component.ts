import { Component, OnInit, Input } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ServiceAgreement } from '../../class/service-agreement';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsHourlyValidate } from '../../contracts-aside/class/contracts-hourly-validate';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';

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
  formatDate: string = FORMAT_DATE_2;
  

  constructor(private companiesStateService: CompaniesStateService,
   
    ) { }

  ngOnInit() {
    console.log("contractsHourly",this.contractsHourly);
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsHourly.companyId);
    
  }
  
  onChangeStartDate(data) {
    this.contractsHourly.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.validate.resetDate();
  }
  onChangeReviewDate(data) {
    this.contractsHourly.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
}
