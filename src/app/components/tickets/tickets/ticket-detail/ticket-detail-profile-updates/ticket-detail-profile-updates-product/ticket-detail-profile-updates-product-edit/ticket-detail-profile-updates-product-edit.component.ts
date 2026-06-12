
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
import { numberDirective } from 'src/app/directives/number/number.directive';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfile } from '../../../../class/ticket-profile';
import { TicketsTableItemRequestedByComponent } from '../../../../tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.component';

@Component({
  standalone: true,
  imports: [MatErrorComponent, TicketsTableItemRequestedByComponent, ProductListComponent, FormsModule, CommonModule, numberDirective],
  selector: 'ticket-detail-profile-updates-product-edit',
  templateUrl: './ticket-detail-profile-updates-product-edit.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product-edit.component.scss']
})
export class TicketDetailProfileUpdatesProductEditComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Input() product: TicketProfileProduct;
  @Input() update: TicketProfileUpdate;
  @Output() onEdit = new EventEmitter();
  editProduct: TicketProfileProduct;
  valdiateSaleCost: boolean = true;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(private productService: ProductService,
    private ticketsService: TicketsService,
    private permissionsService: PermissionsService,
    public usersStateService: UsersStateService,
    public ticketsListService: TicketsListService) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
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
  getUserById(id) {
    return this.usersStateService.getAllUsers().find(item => item.id == id);
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
