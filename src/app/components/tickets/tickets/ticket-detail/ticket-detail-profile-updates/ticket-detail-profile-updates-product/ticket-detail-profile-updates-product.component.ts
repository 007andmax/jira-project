import { Component, Input, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL, REMOVE_UPDATE_TICKET_DETAIL_PRODUCT } from 'src/app/const/confirm';
import { TicketProfileProduct } from '../../../class/ticket-profile-product';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketsListService } from '../../../services/tickets-list.service';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfile } from '../../../class/ticket-profile';

@Component({
  selector: 'ticket-detail-profile-updates-product',
  templateUrl: './ticket-detail-profile-updates-product.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product.component.scss']
})
export class TicketDetailProfileUpdatesProductComponent implements OnInit {
  classActions: string = '';
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Input() update: TicketProfileUpdate;
  @Input() isBlockChange: boolean;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(public ticketsListService: TicketsListService,
    public confirmStateService: ConfirmStateService,
    public ticketStateService: TicketStateService,
    public usersStateService: UsersStateService,
    public modalService: NgbModal) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
  getUserById(id) {
    return this.usersStateService.getAllUsers().find(item => item.id == id);
  }
  public getTotal(price, quantity) {
    return price * quantity;
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  public trackByIndex(index, item) {
    return index;
  }
  public trackById(index, item) {
    return item.id;
  }

  isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Ticket`;
    modalRef.componentInstance.message = `The ticket update containing a service will become inaccessible. Continue with permanent deletion?`;
  }
  removeProduct() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setProductForRemove(this.update.products[0]);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Ticket`;
    modalRef.componentInstance.message = `Are you sure you want to remove the item?`;

  }
  edit() {
    let update = new TicketProfileUpdate(JSON.parse(JSON.stringify(this.update)));
    update.products = [new TicketProfileProduct(JSON.parse(JSON.stringify(this.update.products[0])))];
    this.ticketStateService.editUpdateByFrom(update);
  }
  setClassForActions(i, data) {
    if (i == 0) this.classActions = data;
  }
}
