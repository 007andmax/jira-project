import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { BillableProfileTicketProductExpense } from '../../../../class/billable-profile-ticket-product-expense';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { InvoiceFormTicketEditTaxesComponent } from '../invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { Tax } from 'src/ng2/app/interfaces/service/tax';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invoice-form-ticket-edit-product',
  templateUrl: './invoice-form-ticket-edit-product.component.html',
  styleUrls: ['./invoice-form-ticket-edit-product.component.scss']
})
export class InvoiceFormTicketEditProductComponent implements OnInit, OnDestroy {
  @Input() product: BillableProfileTicketProductExpense;
  @ViewChild('taxes') taxesDropDown: InvoiceFormTicketEditTaxesComponent;
  valdiateSaleCost: boolean = true;
  taxes: Array<Tax> = [];
  sub: Subscription = new Subscription();
  constructor(private taxesStateService: TaxesStateService,) { }

  ngOnInit() {
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = [...this.taxes, ...data];
      this.onSetEditTaxes();
    })
    this.onSetEditTaxes();
    this.sub.add(getOnTaxess);
  }
  onSetEditTaxes() {
    let notFindTax = [];
    let taxes = this.taxes.filter(item => {
      let index = this.product.taxes.findIndex(tax => tax.name === item.name && tax.rate === item.rate);
      return (index > -1) ? true : false;
    })
    this.product.taxes.forEach(item => {
      let index = this.taxes.findIndex(tax => tax.name === item.name && tax.rate === item.rate);
      if (index === -1) {
        this.taxesDropDown.addTax(item);
        notFindTax.push(item);
      }
    });
    taxes = [...taxes, ...notFindTax];
    this.taxesDropDown.setEditItems(taxes);
  }
  onTaxesChange(data) {
    this.product.taxes = data;
  }
  onValidateSaleCost() {
    if (this.product.item.sale > this.product.item.cost) this.valdiateSaleCost = true;
  }
  public onChangeSale(val) {
    let value = Number(val);
    this.product.item.sale = value;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
