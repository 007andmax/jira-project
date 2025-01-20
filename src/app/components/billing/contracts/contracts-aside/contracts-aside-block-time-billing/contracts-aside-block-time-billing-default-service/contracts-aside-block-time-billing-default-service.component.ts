import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ContractsBlockTimeDefaultService } from '../../class/contracts-block-time-default-service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { TaxesComponent } from 'src/app/components/shared/taxes/taxes.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contracts-aside-block-time-billing-default-service',
  templateUrl: './contracts-aside-block-time-billing-default-service.component.html',
  styleUrls: ['./contracts-aside-block-time-billing-default-service.component.scss']
})
export class ContractsAsideBlockTimeBillingDefaultServiceComponent implements OnInit, OnDestroy {
  @Input() service: ContractsBlockTimeDefaultService;
  @Output() onRemove = new EventEmitter<any>();
  @ViewChild('taxesDropDown', { static: true }) taxesDropDown: TaxesComponent;
  sub: Subscription = new Subscription();
  constructor(private taxesStateService: TaxesStateService,) { }

  ngOnInit() {
    if (this.taxesStateService.getTaxes().length > 0) this.getTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.getTaxes(data);
    })
    this.sub.add(getOnTaxess);
  }
  onChangeDiscountAmount(event) {
    this.service.discountAmount = event;
  }
  onChangeDiscount(data) {
    this.service.discountType = data.type;
  }
  getTaxes(taxes) {

    let listTaxes = [];
    this.service.taxIds.forEach(id => {
      let find = taxes.find(tax => tax.id === id);
      if (find) listTaxes.push(find);

    });
    this.taxesDropDown.setEditItems(listTaxes);
  }
  remove() {
    this.onRemove.emit(null);
  }
  onTaxesChange(data) {
    this.service.taxIds = data.map(item => item.id);
  }

  public onChangeRate(val) {
    let value = Number(val);
    this.service.rate = value;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
