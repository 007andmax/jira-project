import { Component, OnInit } from '@angular/core';
import { TicketProfileFormProduct } from '../../../ticket-edit-aside/class/ticket-profile-form-product';
import { TicketProfileFormUpdateProductsComponent } from '../../../ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update-products/ticket-profile-form-update-products.component';

@Component({
  selector: 'ticket-detail-profile-form-update-products',
  templateUrl: './ticket-detail-profile-form-update-products.component.html',
  styleUrls: ['./ticket-detail-profile-form-update-products.component.scss']
})
export class TicketDetailProfileFormUpdateProductsComponent extends TicketProfileFormUpdateProductsComponent {

  clearForm(taxesDropDown) {
    this.currentProduct = new TicketProfileFormProduct(JSON.parse(JSON.stringify(this.addedProductList[0])));
    this.productDP.setEditItem(this.currentProduct.item);
    taxesDropDown.setEditItems(this.currentProduct.item.taxes);
    this.addedProductList = [];
  }
}
