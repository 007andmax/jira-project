import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ContractsBlockTimeDefaultService } from '../../class/contracts-block-time-default-service';
import { InvoiceFormTicketEditTaxesComponent } from '../../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';

@Component({
  selector: 'app-contracts-aside-block-time-billing-default-service',
  templateUrl: './contracts-aside-block-time-billing-default-service.component.html',
  styleUrls: ['./contracts-aside-block-time-billing-default-service.component.scss']
})
export class ContractsAsideBlockTimeBillingDefaultServiceComponent implements OnInit {
  @Input() service: ContractsBlockTimeDefaultService;
  @Output() onRemove = new EventEmitter<any>();
  @ViewChild('taxesDropDown') taxesDropDown: InvoiceFormTicketEditTaxesComponent;
  constructor(private taxesStateService: TaxesStateService,) { }

  ngOnInit() {
    if (this.taxesStateService.getTaxes().length > 0) this.getTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.getTaxes(data);

    })
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
}
