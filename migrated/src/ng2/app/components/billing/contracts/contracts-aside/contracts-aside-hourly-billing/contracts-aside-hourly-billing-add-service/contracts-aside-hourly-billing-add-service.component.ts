import { Component, OnInit } from '@angular/core';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';

@Component({
  selector: 'app-contracts-aside-hourly-billing-add-service',
  templateUrl: './contracts-aside-hourly-billing-add-service.component.html',
  styleUrls: ['./contracts-aside-hourly-billing-add-service.component.scss']
})
export class ContractsAsideHourlyBillingAddServiceComponent implements OnInit {
  service: DefaultServices = new DefaultServices();
 
  sub: Subscription = new Subscription();
  validate: DefaultServiceValidate = new DefaultServiceValidate();
  defaultSelectedTax: Array<Tax> = [];
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  @ViewChild('glNumberSelect') glNumberSelect: SelectSearchComponent;
  @Output() onClose = new EventEmitter<any>();
  constructor( private taxesStateService: TaxesStateService,) { }

  ngOnInit() {
    if (this.taxesStateService.getTaxes().length > 0) this.setDefaultTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.setDefaultTaxes(data);
    })
    this.sub.add(getOnTaxess);
  }
  private setDefaultTaxes(lsitTaxes) {
    let taxes = lsitTaxes.filter(item => item.isDefault === true);
    this.service.taxes = taxes;
    this.defaultSelectedTax = taxes;
    this.taxesStateService.setTaxesFromtEdit(taxes);
  }

}
