import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileProduct } from '../../../../class/ticket-profile-product';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { TicketsListService } from '../../../../services/tickets-list.service';
import * as moment from 'moment';

@Component({
  selector: 'app-ticket-profile-updates-product-edit',
  templateUrl: './ticket-profile-updates-product-edit.component.html',
  styleUrls: ['./ticket-profile-updates-product-edit.component.scss'],
  providers: [TicketsListService]
})
export class TicketProfileUpdatesProductEditComponent implements OnInit {
  @Input() product: TicketProfileProduct;
  @Input() update: TicketProfileUpdate;
  public productList = [];
  editProduct: TicketProfileProduct;
  constructor(private productService: ProductService,
    public ticketsListService: TicketsListService) { }

  ngOnInit() {
    this.editProduct = JSON.parse(JSON.stringify(this.product));
    this.getItemListProducts();
  }
  public getTotal(price, quantity) {
    return price * quantity;
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  onChangeProduct(item) {
    this.editProduct.item = item;
    this.editProduct.quantity = 1;
  }
  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      this.productList = res;

    });
  }
}
