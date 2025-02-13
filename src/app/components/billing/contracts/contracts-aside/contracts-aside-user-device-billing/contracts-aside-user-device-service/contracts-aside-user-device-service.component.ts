import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TaxesComponent } from 'src/app/components/shared/taxes/taxes.component';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { ContractsUserDeviceService } from '../../class/contracts-user-device-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contracts-aside-user-device-service',
  templateUrl: './contracts-aside-user-device-service.component.html',
  styleUrls: ['./contracts-aside-user-device-service.component.scss']
})
export class ContractsAsideUserDeviceServiceComponent implements OnInit, OnDestroy {
  @Input() invoiceAsSingleItem: boolean = false;
  @Input() service: ContractsUserDeviceService;
  @Output() onRemove = new EventEmitter<any>();
  @Output() onCheckName = new EventEmitter<any>();
  @Output() onDisplayBillableTooltip = new EventEmitter<any>();
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
  public setSelectedTaxes(listTaxes) {
    this.taxesDropDown.setEditItems(listTaxes);
    this.service.taxes = listTaxes;
    this.onChangeTaxSum();
  }
  getTaxes(taxes) {
    let listTaxes = [];

    this.service.taxIds.forEach(id => {
      let find = taxes.find(tax => tax.id === id);
      if (find) listTaxes.push(find);
    });
    this.service.taxes = listTaxes;
    this.onChangeTaxSum();
    this.setSelectedTaxes(listTaxes);
  }
  onChangeCount(event) {
    this.service.count = event;
    this.onChangeTaxSum();
  }
  onChangeDisplayBillableTooltip() {
    this.onDisplayBillableTooltip.emit(null);
  }
  remove() {
    this.onRemove.emit(null);
  }
  onTaxesChange(data) {
    this.service.taxIds = data.map(item => item.id);
    this.service.taxes = data;
    this.onChangeTaxSum();
    this.onChangeDisplayBillableTooltip();
  }
  public onChangeTaxSum() {
    let rate = this.service.taxes.map(item => item.rate).reduce((a, b) => a + b, 0);
    this.service.taxSum = this.service.count * this.service.rate * rate / 100;
  }
  onChangeDiscount(data) {
    this.service.discountType = data.type;
  }
  checkName() {
    this.onCheckName.emit(null);
  }
  onChange() {
    this.service.setValidate(true);
    this.service.setValidateDuplicated(true);
  }
  public onChangeRate(val) {
    let value = Number(val);
    this.service.rate = value;
    this.onChangeTaxSum();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
