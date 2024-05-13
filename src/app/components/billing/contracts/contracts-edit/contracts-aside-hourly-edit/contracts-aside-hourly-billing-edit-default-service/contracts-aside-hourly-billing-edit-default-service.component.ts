import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
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
  @ViewChild('taxes') taxesDropDown: TaxesComponent;
  @Output() onSelectService = new EventEmitter<any>();
  constructor(private taxesStateService: TaxesStateService,) { }

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
  onTaxesChange(data) {
    this.service.taxIds = data.map(item => {
      return item.id;
    });
  }
  toggleService() {
    this.onSelectService.emit(null);
  }
  public onChangeRate(val) {
    let value = Number(val);
    this.service.rate = value;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
