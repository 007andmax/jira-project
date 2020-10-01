import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { InvoiceFormTicketEditTaxesComponent } from '../../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { DefaultServicesHourlyContract } from '../../class/default-service-hourly-contract';

@Component({
  selector: 'app-contracts-aside-hourly-billing-default-service',
  templateUrl: './contracts-aside-hourly-billing-default-service.component.html',
  styleUrls: ['./contracts-aside-hourly-billing-default-service.component.scss']
})
export class ContractsAsideHourlyBillingDefaultServiceComponent implements OnInit {
  @Input() defaultService: DefaultServicesHourlyContract;
  @ViewChild('taxes') taxesDropDown: InvoiceFormTicketEditTaxesComponent;
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
