
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ProductService } from 'src/app/services/product/product.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketProfileProduct } from '../../../../class/ticket-profile-product';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';
import { ProductListComponent } from 'src/app/components/shared/product-list/product-list.component';

@Component({
  standalone: true,
  imports: [MatErrorComponent, ProductListComponent, FormsModule, CommonModule],
  selector: 'ticket-detail-profile-updates-product-edit',
  templateUrl: './ticket-detail-profile-updates-product-edit.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product-edit.component.scss']
})
export class TicketDetailProfileUpdatesProductEditComponent implements OnInit {
  @Input() product: TicketProfileProduct;
  @Input() update: TicketProfileUpdate;
  @Output() onEdit = new EventEmitter();
  editProduct: TicketProfileProduct;
  valdiateSaleCost: boolean = true;
  constructor(private productService: ProductService,
    private ticketsService: TicketsService,
    private permissionsService: PermissionsService,
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
    let value = Number(val.target.value);
    this.editProduct.item.sale = value;
    this.editProduct.item.sale_str = value.toFixed(2);

  }
  onValidateSaleCost() {
    if (this.editProduct.item.sale > this.editProduct.item.cost) this.valdiateSaleCost = true;
  }
  onChangeProduct(item) {
    this.editProduct.item = item;
    this.editProduct.quantity = 1;
    if (this.editProduct.item.sale > this.editProduct.item.cost) this.valdiateSaleCost = true;
  }

  saveProduct() {
    this.valdiateSaleCost = (this.editProduct.item.sale < this.editProduct.item.cost) ? false : true;
    if (!this.valdiateSaleCost) return;
    this.ticketsService.updateExpense(this.editProduct.getDateForUpdate(this.update.id)).subscribe(data => {
      this.onEdit.emit(null);
    })

  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  cancelProduct() {
    this.onEdit.emit(null);
  }
}
