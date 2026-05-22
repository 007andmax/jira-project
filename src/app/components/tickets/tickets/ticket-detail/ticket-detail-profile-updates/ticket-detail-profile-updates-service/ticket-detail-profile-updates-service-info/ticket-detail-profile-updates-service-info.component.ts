import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET, REMOVE_UPDATE_TICKET_DETAIL_SERVICE } from 'src/app/const/confirm';
import { TicketProfileService } from '../../../../class/ticket-profile-service';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { TicketStateService } from '../../../../ticket-edit-aside/services/ticket-state.service';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';

@Component({
  selector: 'ticket-detail-profile-updates-service-info',
  templateUrl: './ticket-detail-profile-updates-service-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-service-info.component.scss']
})
export class TicketDetailProfileUpdatesServiceInfoComponent implements OnInit, OnDestroy {
  @Input() showCompleteLabel: boolean = false;
  @Input() index: number;
  @Input() update: TicketProfileUpdate;
  @Input() service: TicketProfileService;
  @Output() onEdit = new EventEmitter();
  @Input() isBlockChange: boolean;
  @ViewChild('dpDate', { static: true }) dpDate: DatePickerComponent;
  changeDate: boolean = false;
  userService = [];
  listTechUsers = [];
  sub: Subscription = new Subscription();
  constructor(public ticketsListService: TicketsListService,
    private usersStateService: UsersStateService,
    public confirmStateService: ConfirmStateService,
    public ticketStateService: TicketStateService,
    private ticketsService: TicketsService,
    private companiesStateService: CompaniesStateService,
    private permissionsService: PermissionsService,
    public modalService: NgbModal) { }
  ngOnInit() {
    if (this.service.date) {
      this.dpDate.editDate = this.service.date;
      this.dpDate.setEditDate(this.service.date);
    }
    if (this.service.user) this.userService = [this.service.user];
    if (this.usersStateService.getAllUsers().length > 0) this.listTechUsers = this.getUsersForAssign();
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.listTechUsers = this.getUsersForAssign();
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.listTechUsers = this.getUsersForAssign();
    })
    this.sub.add(onChangeUsers);
    if (this.service.date) this.setDateWithTimeOffset();
  }

  public setDateWithTimeOffset() {
    this.service.date = this.service.date + this.getTimeOffSet();
  }
  public getDate(date) {
    if (this.changeDate) return moment((date) ? new Date(date + this.getTimeOffSet()) : new Date()).format('DD MMM YYYY');
    return moment((date) ? new Date(date) : new Date()).format('DD MMM YYYY');
  }
  private getTimeOffSet() {
    // getting milliseconds of a date, after calculating timeOffSet of the tech user and timeOffset of the technical company
    let currentTimeOffset = new Date().getTimezoneOffset() * 60000;
    currentTimeOffset = (currentTimeOffset < 0) ? -currentTimeOffset : currentTimeOffset;
    let companyTimeOffset = this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset;
    companyTimeOffset = (companyTimeOffset < 0) ? -companyTimeOffset : companyTimeOffset;
    return (currentTimeOffset > companyTimeOffset) ? currentTimeOffset - companyTimeOffset : companyTimeOffset - currentTimeOffset;

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
  public isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  setComplete() {
    if (this.isBlockChange) return;
    this.service.setCompleted(!this.service.completed);
    this.updateService();
  }
  public onChangeDatePicker(data) {
    this.service.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.updateService();
    this.changeDate = true;
  }
  private updateService() {
    this.ticketsService.updateExpense(this.service.getDateForUpdate(this.update.id)).subscribe(data => {

    })
  }
  public onChangeUser(data) {
    if (data.length === 0) this.service.setUser({ id: "" });
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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Ticket`;
    modalRef.componentInstance.message = `The ticket update containing a service will become inaccessible. Continue with permanent deletion?`;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  edit() {
    let update = new TicketProfileUpdate(JSON.parse(JSON.stringify(this.update)));
    update.services = [new TicketProfileService(JSON.parse(JSON.stringify(this.service)))];
    update.setUserUpdate(this.service.user);
    this.ticketStateService.editUpdateByFrom(update);
  }
  removeService() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setServiceForRemove(this.service);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL_SERVICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Ticket`;
    modalRef.componentInstance.message = `Are you sure you want to remove the item?`;
  }
}
