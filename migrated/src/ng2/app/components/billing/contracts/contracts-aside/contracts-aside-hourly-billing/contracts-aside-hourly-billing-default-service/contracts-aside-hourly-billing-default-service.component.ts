import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { InvoiceFormTicketEditTaxesComponent } from '../../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';

@Component({
  selector: 'app-contracts-aside-hourly-billing-default-service',
  templateUrl: './contracts-aside-hourly-billing-default-service.component.html',
  styleUrls: ['./contracts-aside-hourly-billing-default-service.component.scss']
})
export class ContractsAsideHourlyBillingDefaultServiceComponent implements OnInit {
@Input() defaultService;
@ViewChild('taxes') taxesDropDown: InvoiceFormTicketEditTaxesComponent;
  constructor() { }

  ngOnInit() {
  /*  let taxes = this.taxes.filter(item => {
      let index = this.defaultService.taxes.findIndex(tax => tax.name === item.name && tax.rate === item.rate);
      return (index > -1) ? true : false;
    })*/
    this.taxesDropDown.setEditItems(this.defaultService.taxes);
  }
  onTaxesChange(data) {
    this.defaultService.taxes = data;
  }
  public onChangeRate(val) {
    let value = Number(val);
    this.defaultService.rate = value;
   }
}
