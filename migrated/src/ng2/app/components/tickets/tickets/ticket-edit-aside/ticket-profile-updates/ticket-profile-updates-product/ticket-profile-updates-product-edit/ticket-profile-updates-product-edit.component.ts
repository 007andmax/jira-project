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
  editProduct: TicketProfileProduct;
  constructor(private productService: ProductService,
    private ticketsService: TicketsService,
    public ticketsListService: TicketsListService) { }

  ngOnInit() {
    this.editProduct = new TicketProfileProduct(this.product);
  }
  public getTotal(price, quantity) {
    return (price * quantity).toFixed(2);
  }
  public getDate(date) {
    return moment((date) ? new Date(date) : new Date()).format('DD MMM YYYY');
  }
  public onChangeSale(val) {
    let value = Number(val);
    this.editProduct.item.sale = value;
  }
  onChangeProduct(item) {
    this.editProduct.item = item;
    this.editProduct.quantity = 1;
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
