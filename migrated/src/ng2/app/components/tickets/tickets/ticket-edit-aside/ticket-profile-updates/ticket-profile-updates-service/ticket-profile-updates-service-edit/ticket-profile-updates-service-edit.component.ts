import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { TicketStateService } from '../../../services/ticket-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { REMOVE_UPDATE_TICKET, REMOVE_UPDATE_TICKET_SERVICE } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm.component';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { TicketProfileService } from '../../../../class/ticket-profile-service';
import { TicketProfileUpdatesServiceTimepickerComponent } from '../../ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.component';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';

@Component({
  selector: 'app-ticket-profile-updates-service-edit',
  templateUrl: './ticket-profile-updates-service-edit.component.html',
  styleUrls: ['./ticket-profile-updates-service-edit.component.scss']
})
export class TicketProfileUpdatesServiceEditComponent implements OnInit {
  @Input() service: TicketProfileService;
  @Input() update: TicketProfileUpdate;
  @ViewChild('editTimePicker') editTimePicker: TicketProfileUpdatesServiceTimepickerComponent;
  @Output() onEdit = new EventEmitter();
  currentCompany = null;
  minutes: number = 0;
  hours: number = 0;
  durationStart: number = 0;
  durationEnd: number = 0;
  quantity: number = 0;
  servicesList = [];
  editService: TicketProfileService;
  constructor(public ticketsListService: TicketsListService,
    private confirmStateService: ConfirmStateService,
    private ticketStateService: TicketStateService,
    private companiesStateService: CompaniesStateService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    private ticketsService: TicketsService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.editService = new TicketProfileService(this.service);
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.quantity = JSON.parse(JSON.stringify(this.service.quantity));
    this.durationStart = this.service.durationStart;
    this.durationEnd = this.service.durationEnd;
    var timeInMinutes = this.service.quantity * 60;
    this.hours = Math.floor(timeInMinutes / 60);
    this.minutes = Math.round(timeInMinutes - (this.hours * 60));
    this.elRef.nativeElement.querySelector('#service-description').value = this.editService.description;
    this.getServices();
    this.ticketStateService.getOnGetServicesList().subscribe(data => {
      this.getServices();
    })
  }
  private getServices() {
    this.servicesList = this.ticketStateService.getServicesForTicket();
  }
  public onChangeDescription(event) {
    this.editService.description = event.target.value;

  }
  public onPastDescription(value) {
    this.editService.description = value;
  }
  public selectService(item) {
    this.editService.item = item;
  }
  public onChangeDuration(quantity) {
    this.quantity = quantity;
    this.cd.detectChanges();
    this.editTimePicker.changeStart();
    this.editService.setQuantity(this.quantity);
  }
  public onChangeEndTimePicker(endDate) {
    this.durationEnd = endDate;
    this.editService.setDurationEnd(this.durationEnd);
    if (this.currentCompany.serviceExpenseDurationPresentation === 'TIME_PICKER') {
      let durationEnd = JSON.parse(JSON.stringify(this.durationEnd));
      if (this.durationStart - this.durationEnd > 0) durationEnd = durationEnd + 24 * 3600000;
      this.quantity = (durationEnd - this.durationStart) / 3600000 > 0 ? (durationEnd - this.durationStart) / 3600000 : 0;
      if (this.quantity > 24) this.quantity -= 24;
      this.editService.setQuantity(this.quantity);
    }
  }
  public onChangeStartTimePicker(startDate) {
    this.durationStart = startDate;
    this.editService.setDurationStart(this.durationStart);
  }
  public onSetDurationEnd(endDate) {
    this.durationEnd = endDate;
    this.editService.setDurationEnd(this.durationEnd);
  }
  private setHoursAndMinutes(quantity) {
    var timeInMinutes = quantity * 60;
    this.hours = Math.floor(timeInMinutes / 60);
    this.minutes = Math.round(timeInMinutes - (this.hours * 60));
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
  saveService() {
    this.ticketsService.updateExpense(this.editService.getDateForUpdate(this.update.id)).subscribe(data => {
      this.onEdit.emit(null);
    })
  }
  cancelService() {
    this.onEdit.emit(null);
  }

  removeService(i) {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setServiceForRemove(this.update.services[i]);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_SERVICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove the item?`;

  }
}
