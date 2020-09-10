import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ContractsHourlyService } from '../../../contracts-aside/class/contracts-hourly-service';
import { InvoiceFormTicketEditTaxesComponent } from '../../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { Tax } from 'src/ng2/class/taxes/tax';

@Component({
  selector: 'app-contracts-aside-hourly-billing-edit-default-service',
  templateUrl: './contracts-aside-hourly-billing-edit-default-service.component.html',
  styleUrls: ['./contracts-aside-hourly-billing-edit-default-service.component.scss']
})
export class ContractsAsideHourlyBillingEditDefaultServiceComponent implements OnInit {
  taxes: Array<Tax> = [];
  @Input() service: ContractsHourlyService;
  @ViewChild('taxes') taxesDropDown: InvoiceFormTicketEditTaxesComponent;
  @Output() onSelectService = new EventEmitter<any>();
  constructor(private taxesStateService: TaxesStateService,) { }

  ngOnInit() {
    if (this.taxesStateService.getTaxes().length > 0) this.getTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.getTaxes(data);

    })

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
}
