import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileProduct } from '../../../class/ticket-profile-product';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketProfileFormProduct } from '../../../ticket-edit-aside/class/ticket-profile-form-product';
import { TicketProfileFormUpdateProductsComponent } from '../../../ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update-products/ticket-profile-form-update-products.component';

@Component({
  selector: 'ticket-detail-profile-edit-updates-products',
  templateUrl: './ticket-detail-profile-edit-updates-products.component.html',
  styleUrls: ['./ticket-detail-profile-edit-updates-products.component.scss']
})
export class TicketDetailProfileEditUpdatesProductsComponent extends TicketProfileFormUpdateProductsComponent {
  @Input() update: TicketProfileUpdate;
  product: TicketProfileProduct = new TicketProfileProduct();
  ngOnInit() {
    this.product = new TicketProfileProduct(this.update.products[0]);
  }
  public selectProduct(item, taxesDropDown) {
    if (item) {
      this.product.setData(item, this.getItemOrger());
      taxesDropDown.selectedTax = item.taxes;
    }
    this.product.valdiateSaleCost = true;
  }
  public onChangeCost(val) {
    let value = Number(val.target.value);
    this.product.item.cost = value;
    this.product.item.cost_str = value.toFixed(2);
  }
  public onValidateSaleCost() {
    if (this.product.item.versionedId) {
      if (Number(this.product.item.sale) > Number(this.product.item.cost)) this.product.valdiateSaleCost = true;
    }
  }
  public onTaxesChange(item) {
    this.product.setTexes(item);
  }
  public onChangeSale(val) {
    let value = Number(val.target.value);
    this.product.item.sale = value;
    this.product.item.sale_str = value.toFixed(2);
  }
}
