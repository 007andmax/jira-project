import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { TaxesComponent } from 'src/app/components/shared/taxes/taxes.component';
import { DefaultServicesHourlyContract } from '../../class/default-service-hourly-contract';
import { numberDirective } from '../../../../../../directives/number/number.directive';
import { TaxesComponent as TaxesComponent_1 } from '../../../../../shared/taxes/taxes.component';
import { DecimalNumberDirective } from '../../../../../../directives/decimal-number/decimal-number.directive';
import { MatErrorComponent } from '../../../../../shared/mat-error/mat-error.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-contracts-aside-hourly-billing-default-service',
    templateUrl: './contracts-aside-hourly-billing-default-service.component.html',
    styleUrls: ['./contracts-aside-hourly-billing-default-service.component.scss'],
    standalone: true,
    imports: [NgClass, FormsModule, NgIf, MatErrorComponent, DecimalNumberDirective, TaxesComponent_1, numberDirective]
})
export class ContractsAsideHourlyBillingDefaultServiceComponent implements OnInit {
  @Input() defaultService: DefaultServicesHourlyContract;
  @ViewChild('taxes', { static: true }) taxesDropDown: TaxesComponent;
  @Output() onSelectService = new EventEmitter<any>();
  constructor(private elRef: ElementRef) { }

  ngOnInit() {
    this.taxesDropDown.setEditItems(this.defaultService.taxes);
  }
  onTaxesChange(data) {
    this.defaultService.taxes = data;
  }
  toggleService(event) {
    if (!event.target.checked) {
      this.defaultService.billable = false;
      this.resetRate();
    }
    this.onSelectService.emit(null);
  }
  onChangeBillable(event) {
    if (!event.target.checked) {
      this.resetRate();
    }
  }
  resetRate() {
    this.defaultService.rate = 0;
    this.defaultService.rate_str = "0.00";
    this.elRef.nativeElement.querySelector(".payment-input").value = "0.00";
  }
  onChangeDiscountAmount(event) {
    this.defaultService.discountAmount = event;
  }
  public onChangeRate(val) {
    let value = Number(val);
    this.defaultService.rate = value;
    this.defaultService.validateRate = true;
  }
  onCeckRate() {
    if (this.defaultService.rate == 0) this.defaultService.billable = false;
  }
  public trackById(index, item) {
    return item.id;
  }
}
