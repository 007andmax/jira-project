import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy, ElementRef } from '@angular/core';
import { ContractsHourlyService } from '../../../contracts-aside/class/contracts-hourly-service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { Tax } from 'src/class/taxes/tax';
import { TaxesComponent } from 'src/app/components/shared/taxes/taxes.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contracts-aside-hourly-billing-edit-default-service',
  templateUrl: './contracts-aside-hourly-billing-edit-default-service.component.html',
  styleUrls: ['./contracts-aside-hourly-billing-edit-default-service.component.scss']
})
export class ContractsAsideHourlyBillingEditDefaultServiceComponent implements OnInit, OnDestroy {
  taxes: Array<Tax> = [];
  sub: Subscription = new Subscription();
  @Input() service: ContractsHourlyService;
  @ViewChild('taxes', { static: true }) taxesDropDown: TaxesComponent;
  @Output() onSelectService = new EventEmitter<any>();
  constructor(private taxesStateService: TaxesStateService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    if (this.taxesStateService.getTaxes().length > 0) this.getTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.getTaxes(data);
    })
    this.sub.add(getOnTaxess);
  }
  getTaxes(taxes) {
    this.taxes = taxes;
    let listTaxes = [];
    this.service.taxIds.forEach(id => {
      let find = this.taxes.find(tax => tax.id === id);
      if (find) listTaxes.push(find);

    });
    this.taxesDropDown.setEditItems(listTaxes);
  }
  onChangeDiscountAmount(event) {
    this.service.discountAmount = event;
  }
  onTaxesChange(data) {
    this.service.taxIds = data.map(item => {
      return item.id;
    });
  }
  toggleService(event) {
    if (!event.target.checked) {
      this.service.billable = false;
      this.resetRate();
    }
    this.onSelectService.emit(null);
  }
  onChangeBillable(event) {
    if (!event.target.checked) {
      this.resetRate();
      console.log("this.service", this.service);
    }
  }
  resetRate() {
    this.service.rate = 0;
    this.service.rate_str = "0.00";
    this.elRef.nativeElement.querySelector(".payment-input").value = "0.00";
  }
  public onChangeRate(val) {
    let value = Number(val);
    this.service.rate = value;
    this.service.validateRate = true;
  }
  onCeckRate() {
    if (this.service.rate == 0) this.service.billable = false;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
