import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { TicketStateService } from '../../../services/ticket-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { TicketProfileProduct } from '../../../../class/ticket-profile-product';
import { REMOVE_UPDATE_TICKET_PRODUCT } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm.component';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

@Component({
  selector: 'app-ticket-profile-updates-product-info',
  templateUrl: './ticket-profile-updates-product-info.component.html',
  styleUrls: ['./ticket-profile-updates-product-info.component.scss']
})
export class TicketProfileUpdatesProductInfoComponent implements OnInit {
  @Input() product: TicketProfileProduct;
  @Input() update: TicketProfileUpdate;
  @Output() onEdit = new EventEmitter();
  userService = [];
  listTehUsers = [];
  constructor(public ticketsListService: TicketsListService,
    private confirmStateService: ConfirmStateService,
    private ticketStateService:TicketStateService,
    private ticketsService:TicketsService,
    private usersStateService:UsersStateService,
    private modalService: NgbModal) { }

  ngOnInit() {
    if (this.product.user) this.userService = [this.product.user];
    this.listTehUsers = this.getUsersForAssign();
  }
  public getTotal(price, quantity) {
    return price * quantity;
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  edit() {
    this.onEdit.emit(null);
  }
  setComplete() {
    this.product.setCompleted(!this.product.completed);
    this.updateProduct();
  }
  private updateProduct() {
    this.ticketsService.updateExpense(this.product.getDateForUpdate(this.update.id)).subscribe(data => {
     // this.productDate = new Date(this.product.date).toISOString();
    })
  }
  public onChangeUser(data) {
    console.log("data", data);
    if (data.length === 0) this.product.setUser({id: ""});
    if (data.length === 1) this.product.setUser(data[0]);
   this.updateProduct();
  }
  public onChangeDatePicker(data) {
 //   console.log("data", data);

    let date = new Date(data.year, data.month - 1, data.day);
  
  /*  let currentDate = new Date(this.productDate);
    console.log("date",date);
    console.log("currentDate",currentDate);
    if (date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) return;
   */
    this.product.setDate(date.toISOString());
    this.updateProduct();
  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);

  }
  removeProduct() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setProductForRemove(this.product);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove the item?`;
    
  }
}
