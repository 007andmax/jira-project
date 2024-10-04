import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { TaxesComponent } from 'src/app/components/shared/taxes/taxes.component';
import { DefaultServicesHourlyContract } from '../../class/default-service-hourly-contract';

@Component({
  selector: 'app-contracts-aside-hourly-billing-default-service',
  templateUrl: './contracts-aside-hourly-billing-default-service.component.html',
  styleUrls: ['./contracts-aside-hourly-billing-default-service.component.scss']
})
export class ContractsAsideHourlyBillingDefaultServiceComponent implements OnInit {
  @Input() defaultService: DefaultServicesHourlyContract;
  @ViewChild('taxes', { static: true }) taxesDropDown: TaxesComponent;
  @Output() onSelectService = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    this.taxesDropDown.setEditItems(this.defaultService.taxes);
  }
  onTaxesChange(data) {
    this.defaultService.taxes = data;
  }
  toggleService() {
    this.onSelectService.emit(null);
  }
  public onChangeRate(val) {
    let value = Number(val);
    this.defaultService.rate = value;
  }
  public trackById(index, item) {
    return item.id;
  }
}
