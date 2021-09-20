import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn.directive';
import { ProductService } from 'src/app/services/product/product.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketProfileProduct } from '../../../class/ticket-profile-product';
import { TicketsListService } from '../../../services/tickets-list.service';

@Component({
  selector: 'ticket-profile-edit-form-update-products',
  templateUrl: './ticket-profile-edit-form-update-products.component.html',
  styleUrls: ['./ticket-profile-edit-form-update-products.component.scss']
})
export class TicketProfileEditFormUpdateProductsComponent implements OnInit {
  @Input() product: TicketProfileProduct;
  @Input() updateId: string;
  @ViewChild('updateMobileBtn') updateMobileBtn: DisabledBtnDirective;
  @Output() onClose = new EventEmitter();
  isUpdate: boolean = false;
  editProduct: TicketProfileProduct;
  valdiateSaleCost: boolean = true;
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
  onValidateSaleCost() {
    if (this.editProduct.item.sale > this.editProduct.item.cost) this.valdiateSaleCost = true;
  }
  onChangeProduct(item) {
    this.editProduct.item = item;
    this.editProduct.quantity = 1;
    if (this.editProduct.item.sale > this.editProduct.item.cost) this.valdiateSaleCost = true;
  }
  public onChangeCost(val) {
    let value = Number(val);
    this.editProduct.item.cost = value;
  }
  saveProduct() {
    this.valdiateSaleCost = (this.editProduct.item.sale < this.editProduct.item.cost) ? false : true;
    if (!this.valdiateSaleCost) return;
    this.isUpdate = true;
    this.updateMobileBtn.setDisabled(true);
    this.ticketsService.updateExpense(this.editProduct.getDateForUpdate(this.updateId)).subscribe(data => {

      this.isUpdate = false;
      this.updateMobileBtn.setDisabled(false);
      this.onClose.emit(null);
    })

  }

}
