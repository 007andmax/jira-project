import { Component, OnInit, Input } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ServiceAgreement } from '../../class/service-agreement';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { Tax } from 'src/ng2/class/taxes/tax';


@Component({
  selector: 'app-contracts-aside-hourly-billing-preview',
  templateUrl: './contracts-aside-hourly-billing-preview.component.html',
  styleUrls: ['./contracts-aside-hourly-billing-preview.component.scss']
})
export class ContractsAsideHourlyBillingPreviewComponent implements OnInit {
  selectedCompany: any;
  selectedTaxes = [];
  taxes:Array<Tax> = [];
  selectedType = new ContractsFilterType('Hourly', 'HOURLY', null);
  @Input() contractsHourly: ServiceAgreement = new ServiceAgreement();
  formatDate: string = FORMAT_DATE_2;
  

  constructor(private companiesStateService: CompaniesStateService,
    private taxesStateService: TaxesStateService,
    ) { }

  ngOnInit() {
    console.log("contractsHourly",this.contractsHourly);
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsHourly.companyId);
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
    });
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
}
