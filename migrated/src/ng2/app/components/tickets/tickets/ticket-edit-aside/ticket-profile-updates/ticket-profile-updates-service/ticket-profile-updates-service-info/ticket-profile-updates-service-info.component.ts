import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { TicketStateService } from '../../../services/ticket-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { REMOVE_UPDATE_TICKET, REMOVE_UPDATE_TICKET_SERVICE } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm.component';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketProfileService } from '../../../../class/ticket-profile-service';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';

@Component({
  selector: 'app-ticket-profile-updates-service-info',
  templateUrl: './ticket-profile-updates-service-info.component.html',
  styleUrls: ['./ticket-profile-updates-service-info.component.scss']
})
export class TicketProfileUpdatesServiceInfoComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  @Input() service: TicketProfileService;
  @Output() onEdit = new EventEmitter();
  userService = [];
  listTehUsers = [];
  constructor(public ticketsListService: TicketsListService,
    private usersStateService: UsersStateService,
    private confirmStateService: ConfirmStateService,
    private ticketStateService: TicketStateService,
    private ticketsService: TicketsService,
    private companiesStateService:CompaniesStateService,
    private modalService: NgbModal) { }

  ngOnInit() {
    if (this.service.user) this.userService = [this.service.user];
    this.listTehUsers = this.getUsersForAssign();
  }
  edit() {
    this.onEdit.emit(null);
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  public getTime(time) {
    return moment(new Date(time)).format('hh:mm A');
  }
  public getDuration(quantity) {
    var timeInMinutes = quantity * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return `${(hours < 10) ? '0' + hours : hours} : ${(minutes < 10) ? '0' + minutes : minutes}`
  }
  setComplete() {
    this.service.setCompleted(!this.service.completed);
    this.updateService();
  }
  public onChangeDatePicker(data) {
    console.log("data", data);

    let date = new Date(data.year, data.month - 1, data.day);
    this.service.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.updateService();
  }
  private updateService() {
    this.ticketsService.updateExpense(this.service.getDateForUpdate(this.update.id)).subscribe(data => {

    })
  }
  public onChangeUser(data) {
    console.log("data", data);
    if (data.length === 0) this.service.setUser({id: ""});
    if (data.length === 1) this.service.setUser(data[0]);
  this.updateService();
  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);

  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `The ticket update containing a service will become inaccessible. Continue with permanent deletion?`;
  }
  removeService(i) {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setServiceForRemove(this.update.services[i]);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_SERVICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove the item?`;

  }
}
