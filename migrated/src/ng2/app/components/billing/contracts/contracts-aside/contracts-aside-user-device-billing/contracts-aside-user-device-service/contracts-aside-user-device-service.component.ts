import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { InvoiceFormTicketEditTaxesComponent } from '../../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { ContractsUserDeviceService } from '../../class/contracts-user-device-service';

@Component({
  selector: 'app-contracts-aside-user-device-service',
  templateUrl: './contracts-aside-user-device-service.component.html',
  styleUrls: ['./contracts-aside-user-device-service.component.scss']
})
export class ContractsAsideUserDeviceServiceComponent implements OnInit {
  @Input() service: ContractsUserDeviceService;
  @Output() onRemove = new EventEmitter<any>();
  @Output() onCheckName = new EventEmitter<any>();
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
  }

}
