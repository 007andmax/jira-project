import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileProduct } from '../../../class/ticket-profile-product';

@Component({
  selector: 'ticket-profile-edit-form-update-products',
  templateUrl: './ticket-profile-edit-form-update-products.component.html',
  styleUrls: ['./ticket-profile-edit-form-update-products.component.scss']
})
export class TicketProfileEditFormUpdateProductsComponent implements OnInit {
  @Input() product: TicketProfileProduct;
  constructor() { }

  ngOnInit() {
    console.log("product", this.product);
  }

}
