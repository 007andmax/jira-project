import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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

@Component({
  selector: 'app-ticket-profile-updates-service-edit',
  templateUrl: './ticket-profile-updates-service-edit.component.html',
  styleUrls: ['./ticket-profile-updates-service-edit.component.scss']
})
export class TicketProfileUpdatesServiceEditComponent implements OnInit {
  @Input() service: TicketProfileService;
  @Input() update: TicketProfileUpdate;
  @ViewChild('editTimePicker') editTimePicker: TicketProfileUpdatesServiceTimepickerComponent;
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
    private modalService: NgbModal) { }

  ngOnInit() {
    this.editService = JSON.parse(JSON.stringify(this.service));
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.quantity = JSON.parse(JSON.stringify(this.service.quantity));
    this.durationStart = this.service.durationStart;
    this.durationEnd = this.service.durationEnd;
    var timeInMinutes = this.service.quantity * 60;
    this.hours = Math.floor(timeInMinutes / 60);
    this.minutes = Math.round(timeInMinutes - (this.hours * 60));
this.elRef.nativeElement.querySelector('#service-description').value = this.editService.description;
    
    console.log("this.service.quantity", this.service.quantity);
    console.log("this.hours", this.hours);
    console.log("this.minutes", this.minutes);
    this.getServices();
    this.ticketStateService.getOnGetServicesList().subscribe(data => {
      this.getServices();
    })
  }
  private getServices() {
    this.servicesList = this.ticketStateService.getServicesForTicket();

  }
  public onChangeDescription(event) {
    //  this.company.description = event.target.value;
    this.editService.description = event.target.value;

  }
  public onPastDescription(value) {
    this.editService.description = value;
    //    this.inventory.description = value;
  }
  public selectService(item) {
    this.editService.item = item;
  }
  public onChangeDuration(quantity) {
    this.quantity = quantity;
    this.editTimePicker.changeStart();
  }
  public onChangeEndTimePicker(endDate) {
    this.durationEnd = endDate;
    if (this.currentCompany.serviceExpenseDurationPresentation === 'TIME_PICKER') {
      let durationEnd = JSON.parse(JSON.stringify(this.durationEnd));


      if (this.durationStart - this.durationEnd > 0) durationEnd = this.durationEnd + 24 * 3600000;
      this.quantity = (durationEnd - this.durationStart) / 3600000 > 0 ? (durationEnd - this.durationStart) / 3600000 : 0;
      if (this.quantity > 24) this.quantity -= 24;
      //  this.setHoursAndMinutes(this.quantity);
      console.log("quantity", this.quantity);
    }
  }
  public onChangeStartTimePicker(startDate) {
    this.durationStart = startDate;
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
