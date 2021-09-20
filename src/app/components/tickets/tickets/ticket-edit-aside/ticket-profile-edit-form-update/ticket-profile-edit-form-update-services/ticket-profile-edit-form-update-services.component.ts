import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn.directive';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketProfileService } from '../../../class/ticket-profile-service';
import { TicketsListService } from '../../../services/tickets-list.service';
import { TicketStateService } from '../../services/ticket-state.service';
import { TicketProfileUpdatesServiceTimepickerComponent } from '../../ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.component';

@Component({
  selector: 'ticket-profile-edit-form-update-services',
  templateUrl: './ticket-profile-edit-form-update-services.component.html',
  styleUrls: ['./ticket-profile-edit-form-update-services.component.scss']
})
export class TicketProfileEditFormUpdateServicesComponent implements OnInit {
  @Input() service: TicketProfileService;
  @Input() updateId: string;
  @ViewChild('updateMobileBtn') updateMobileBtn: DisabledBtnDirective;
  @ViewChild('editTimePicker') editTimePicker: TicketProfileUpdatesServiceTimepickerComponent;
  @Output() onClose = new EventEmitter();
  validate: boolean = true;
  validateQuantity: boolean = true;
  currentCompany = null;
  minutes: number = 0;
  hours: number = 0;
  isUpdate: boolean = false;
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
    this.getServices();
    this.ticketStateService.getOnGetServicesList().subscribe(data => {
      this.getServices();
    })
    console.log("this.editService", this.editService);
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
  public onChangeDatePicker(data) {
    let date = new Date(data.year, data.month - 1, data.day);
    this.service.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

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
    if (!this.validate || !this.validateQuantity) return;
    this.isUpdate = true;
    this.updateMobileBtn.setDisabled(true);
    this.ticketsService.updateExpense(this.editService.getDateForUpdate(this.updateId)).subscribe(data => {
      //  this.onEdit.emit(null);
      this.isUpdate = false;
      this.updateMobileBtn.setDisabled(false);
      this.onClose.emit(null);
    })
  }



}
