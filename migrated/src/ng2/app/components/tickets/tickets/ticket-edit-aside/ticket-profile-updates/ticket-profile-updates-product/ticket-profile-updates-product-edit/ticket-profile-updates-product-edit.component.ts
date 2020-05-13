import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TicketProfileProduct } from '../../../../class/ticket-profile-product';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { TicketsListService } from '../../../../services/tickets-list.service';
import * as moment from 'moment';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';

@Component({
  selector: 'app-ticket-profile-updates-product-edit',
  templateUrl: './ticket-profile-updates-product-edit.component.html',
  styleUrls: ['./ticket-profile-updates-product-edit.component.scss'],
  providers: [TicketsListService]
})
export class TicketProfileUpdatesProductEditComponent implements OnInit {
  @Input() product: TicketProfileProduct;
  @Input() update: TicketProfileUpdate;
  @Output() onEdit = new EventEmitter();
  public productList = [];
  editProduct: TicketProfileProduct;
  constructor(private productService: ProductService,
    private ticketsService: TicketsService,
    public ticketsListService: TicketsListService) { }

  ngOnInit() {
    this.editProduct = new TicketProfileProduct(this.product);
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
  saveProduct() {
    this.ticketsService.updateExpense(this.editProduct.getDateForUpdate(this.update.id)).subscribe(data => {
      this.onEdit.emit(null);
     })
 
  }
  cancelProduct() {
    this.onEdit.emit(null);
  }
}
