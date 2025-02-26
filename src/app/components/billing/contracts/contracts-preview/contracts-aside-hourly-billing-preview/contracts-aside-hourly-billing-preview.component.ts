import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ServiceAgreement } from '../../class/service-agreement';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { Tax } from 'src/class/taxes/tax';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-contracts-aside-hourly-billing-preview',
  templateUrl: './contracts-aside-hourly-billing-preview.component.html',
  styleUrls: ['./contracts-aside-hourly-billing-preview.component.scss']
})
export class ContractsAsideHourlyBillingPreviewComponent implements OnInit, OnDestroy {
  selectedCompany: any;
  selectedTaxes = [];
  taxes: Array<Tax> = [];
  selectedType = new ContractsFilterType('Hourly', 'HOURLY', null);
  @Input() contractsHourly: ServiceAgreement = new ServiceAgreement();
  formatDate: string = FORMAT_DATE_2;
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private taxesStateService: TaxesStateService,
  ) { }

  ngOnInit() {

  }
  ngDoCheck() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsHourly.companyId);
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
    });
    this.sub.add(getOnTaxess);
  }
  getDiscount(item) {
    return item.discountAmount && item.discountAmount != undefined ? `${item.discountAmount} %` : '';
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
